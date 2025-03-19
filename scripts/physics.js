

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
    }
    iterate(){
       iterateThing(this)
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
        thing.x=thing.landed.x+(thing.landed.r+thing.r*0.9)*Math.cos(r2p)
        thing.y=thing.landed.y+(thing.landed.r+thing.r*0.9)*Math.sin(r2p)
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