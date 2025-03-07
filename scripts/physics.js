

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
        this.x += this.vx
        this.y += this.vy
        this.rot += this.vr

        for(var i = 0; i < planets.length; i ++){
            const grav = getGravity(this.x, this.y, planets[i].x, planets[i].y, planets[i].r * config.planetInfluenceFactor)
            this.vx += -grav.x * planets[i].mass
            this.vy += -grav.y * planets[i].mass
            if(grav.dist<this.r+planets[i].r){this.landed = planets[i]}
            // console.log(planets[i].mass)
        }

        if(this.landed != null){
            const r2p = Math.atan2(this.y-this.landed.y, this.x-this.landed.x)//rot to planet
            this.rot = r2p
            this.vr=0;this.vx=0;this.vy=0
            this.x=this.landed.x+(this.landed.r+this.r*0.9)*Math.cos(r2p)
            this.y=this.landed.y+(this.landed.r+this.r*0.9)*Math.sin(r2p)
        }

    }
}

function iteratePhysics(){
    for(var i = 0; i < pobjects.length; i++){
        pobjects[i].iterate()
    }
}