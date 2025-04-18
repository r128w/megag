

function getGravity(x1, y1, x2, y2, distMax=config.gravLimit){// returns the two multipliers for x and y according to newtons universal law

    // getGravCube(x1, y1, x2, y2)

    // holy moly this math took forever to make
    const dx = x2-x1
    const dy = y2-y1
    if(dx>config.gravLimit||dx<-config.gravLimit||dy>config.gravLimit||dy<-config.gravLimit){return{x:0,y:0,d2p:config.gravLimit}}// no calculation
    const d2ps = dx*dx+dy*dy
    const d2p = (Math.sqrt(d2ps))// distance to point
    if(d2p>distMax){return {x:0,y:0,d2p:d2p}}// no grav over distmax
    const ood2p = 1/d2p// one over distance to point
    const ood2ps = config.bigG/d2ps// one over. included big g bc it needs to be somewhere

    return {
        x: -ood2ps*dx*ood2p,
        y: -ood2ps*dy*ood2p,
        dist: d2p
    }
}

// function getGravCube(x1, y1, x2, y2){
//     const dx = x2-x1
//     const dy = y2-y1
//     if(dx>gravLimit||dx<-gravLimit||dy>gravLimit||dy<-gravLimit){return{x:0,y:0,d2p:gravLimit}}// no calculation
//     const d2ps = dx*dx+dy*dy
//     const d2p = (Math.sqrt(d2ps))// distance to point
//     const ood2p = 1/d2p// one over distance to point
//     const ood2ps = bigG/d2ps// one over. included big g bc it needs to be somewhere

//     return {
//         x: -ood2ps*dx*ood2ps*ood2p,
//         y: -ood2ps*dy*ood2ps*ood2p,
//         dist: d2p
//     }
// }

// function getOldGravity(x1, y1, x2, y2){
//     const dx = x2-x1
//     const dy = y2-y1
//     const d2ps = dx*dx+dy*dy
//     const total = bigG / d2ps

//     return {
//         x: -(Math.abs(dx)*dx)/d2ps * total,
//         y: -(Math.abs(dy)*dy)/d2ps * total,
//         dist: Math.sqrt(d2ps)
//     }
// }

var pobjects = []

class PhysicsObject {
    constructor(x, y, r){
        // all physicsobjects are circular
        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0
        this.vr = 0
        this.rot = 0
        this.r = r
        this.landed = null
        this.hp = 5
        this.maxhp = 5
        this.id = Date.now()-Math.trunc(Math.random()*100000000)// has gotta be unique ong
    }
    iterate(){
        iterateThing(this)
        if(this.hp <= 0){
            this.destroy()// if this is a player, destroy is overriden
        }
        if(Math.abs(this.x) + Math.abs(this.y) > config.systemSize){this.destroy()}//destroys most objects, respawns players
    }
    destroy(){// if it is destroyed
        pobjects.splice(pobjects.lastIndexOf(this), 1)
        for(var i = 0; i < 20; i ++){
            const angle = Math.random()*360//radians
            const s = Math.random()*4
            addParticle({
                x: this.x,
                y: this.y,
                vx: this.vx - s*Math.cos(angle),
                vy: this.vy - s*Math.sin(angle),
                age: 0
            })
        }
    }
}

function iterateThing(thing){
    thing.x += thing.vx
    thing.y += thing.vy
    thing.rot += thing.vr

    for(var i = 0; i < planets.length; i ++){
        const grav = getGravity(thing.x, thing.y, planets[i].x, planets[i].y, planets[i].r * config.planetInfluenceFactor)
        thing.vx += -grav.x * planets[i].mass
        thing.vy += -grav.y * planets[i].mass
        if(grav.dist<thing.r+planets[i].r){thing.landed = planets[i]}
        // console.log(planets[i].mass)
    }

    if(thing.landed != null){
        const r2p = Math.atan2(thing.y-thing.landed.y, thing.x-thing.landed.x)//rot to planet
        thing.rot = r2p
        thing.vr=0;thing.vx=0;thing.vy=0
        thing.x=thing.landed.x+(thing.landed.r+thing.r - 2)*Math.cos(r2p)
        thing.y=thing.landed.y+(thing.landed.r+thing.r - 2)*Math.sin(r2p)
    }

    switch(thing.class){
        case 'Bullet':
            thing.vr = 0
            // thing.rot = Math.atan2(thing.vy, thing.vx)
            thing.age ++
            if(thing.landed || thing.age > thing.lifetime){// ten second lifetime on average
                thing.x = -10000000// remove from game until it gets deleted by owner
            }

            if(!pobjects.includes(thing)){
                // only collides with players' own objects
                for(var i = 0; i < pobjects.length; i++){

                    // if(pobjects[i] == this){continue}
                    const d = dist(thing.x, thing.y, pobjects[i].x, pobjects[i].y)
                    if(d < thing.r + pobjects[i].r && d != 0){
                        // hit
                        pobjects[i].hp -= thing.damage
                        // sent to the shadow realm so that it can be deleted, later
                        thing.x = -10000000
                    }
                }
            }

            for(var i = 0; i < config.playerMax; i++){
                if(!sync.conns[i].open){continue}
                if(sync.others[i].obj.includes(thing)){continue}// to replace w alliance check or similar
                for(var ii = 0; ii < sync.others[i].obj.length; ii++){
                    let o = sync.others[i].obj[ii]
                    if(dist(thing.x, thing.y, o.x, o.y) < thing.r + o.r){
                        o.hp-=thing.damage // will get overwritten with what is 'correct'
                        thing.x = -10000000
                    }
                }
            }

            break
        case 'Platform':break
        case 'Player':// fix this later todo
            if(thing.grabbed != null){
                let grabbedobj = null
                if(thing.id == sync.self.index){grabbedobj = thing.grabbed}
                for(var i = 0; i < sync.others[thing.id].obj.length; i ++){
                    if(sync.others[thing.id].obj[i].id == thing.grabbed.id){
                        grabbedobj = sync.others[thing.id].obj[i]
                        break
                    }
                }
                if(grabbedobj == null){console.log('weird grab value');break}// shouldnt happen ordinarily
                grabbedobj.landed = null;
                grabbedobj.x = thing.x + (thing.r+grabbedobj.r)*Math.cos(thing.rot) - thing.vx // correction terms for visual disconnect
                grabbedobj.y = thing.y + (thing.r+grabbedobj.r)*Math.sin(thing.rot) - thing.vy
                grabbedobj.vx = thing.vx
                grabbedobj.vy = thing.vy
                grabbedobj.rot = thing.rot
                grabbedobj.vr = thing.vr
                // console.log(thing.grabbed)
            }
            break
    }



}


function iteratePhysics(){
    for(var i = 0; i < pobjects.length; i++){
        pobjects[i].iterate()
    }
    for(var i = 0; i < config.playerMax; i++){
        if(sync.conns[i].open){
            for(var ii = 0; ii < sync.others[i].obj.length; ii++){
                iterateThing(sync.others[i].obj[ii])
            }
        }
    }
}