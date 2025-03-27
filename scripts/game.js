class Player extends PhysicsObject{
    constructor(x, y){
        super(x, y, 16)
        this.grabbed = null
        this.username = ''
        this.class = 'Player'
        this.col = '#ffffff'// default color
        this.username = 'Anonymous'// default name

        this.shoot = {cooldown:0}
        this.boost = {f:90,max:90}// just enough to orbit
        this.resources = {
            mg:300,// magnesium
            no3:400,
            se:10
        }
    }
    iterate(){

        // this.vr*=0.95// angular drag for the weak
             
        const rspeed = 0.002 * 
        Math.max(0, 1 - Math.abs(this.vr - 0.2)) 
        * (this.grabbed!=null ? 1-(0.63*Math.atan(0.1*this.grabbed.r)):1)

        if(input.a){this.vr-=rspeed}
        if(input.d){this.vr+=rspeed}

        const acc = 0.02

        this.boost.f = Math.min(this.boost.f+(!!this.landed ? 1 : 0.1), this.boost.max)

        if(input.w){
            const dx = acc * Math.cos(this.rot)
            const dy = acc * Math.sin(this.rot)
            const speed = (input.shift && this.boost.f > 1 ? 3 : 1)// shift to overdrive
            if(input.shift){this.boost.f=Math.max(this.boost.f-1, 0)}
            this.vx+=dx*speed
            this.vy+=dy*speed
            addParticle({
                x: this.x - 150*dx + 3*(Math.random()-0.5),
                y: this.y - 150*dy + 3*(Math.random()-0.5),
                vx: this.vx - 10*dx + (Math.random()-0.5),
                vy: this.vy - 10*dy + (Math.random()-0.5),
                age: 0
            })
        }

        if(input.s){
            this.vx+= -0.5 * acc * Math.cos(this.rot)
            this.vy+= -0.5 * acc * Math.sin(this.rot)
        }

        this.shoot.cooldown--
        if(input.space && this.shoot.cooldown <= 0 && this.grabbed == null){
            this.shoot.cooldown = 30
            const iv = 5 // initial velocity
            const dx = Math.cos(this.rot)
            const dy = Math.sin(this.rot)
            const b = new Bullet(this.x+this.r*dx, this.y+this.r*dy, this.vx+iv*dx, this.vy+iv*dy)
            b.rot = this.rot
            pobjects.push(b)
            smallUpdate(b)// tell everyone about this shiny new thing
        }

        if(this.landed != null){
            if(input.w){
                const r2p = Math.atan2(this.y-this.landed.y, this.x-this.landed.x)//rot to planet
                const launchSpeed = ((input.s ? 2 : 10) * config.bigG*this.landed.r/(400) + 1.5);
                var dir = -(input.a-input.d)
                this.vx+=launchSpeed*Math.cos(r2p)
                this.vy+=launchSpeed*Math.sin(r2p)

                this.vx+=0.2*launchSpeed*Math.cos(r2p+1.57)*dir
                this.vy+=0.2*launchSpeed*Math.sin(r2p+1.57)*dir

                this.x+=launchSpeed*2*Math.cos(r2p)// get off the surface
                this.y+=launchSpeed*2*Math.sin(r2p)
                this.landed=null
                // console.log(this.vx)
            }

            if(input.e){// mining
                if(Date.now()%100 < 3){
                    if(this.landed.resources.mg > 0){
                        this.resources.mg++;this.landed.resources.mg--
                    }
                    if(this.landed.resources.no3 > 0){
                        this.resources.no3++;this.landed.resources.no3--
                    }
                    smallUpdate({id:planets.indexOf(this.landed), value:this.landed.resources}, 3)// sync resource amount betwixt players (one shared resource pool)
                    // this may cause weirdness race conditions etc when two players are mining but its chill
                }
            }
        }


        super.iterate()


        // if(this.grabbed != null){
        //     this.grabbed.landed = null;
        //     this.grabbed.x = this.x + (this.r+this.grabbed.r)*Math.cos(this.rot) - this.vx // correction terms for visual disconnect
        //     this.grabbed.y = this.y + (this.r+this.grabbed.r)*Math.sin(this.rot) - this.vy
        //     this.grabbed.vx = this.vx
        //     this.grabbed.vy = this.vy
        //     this.grabbed.rot = this.rot
        //     this.grabbed.vr = this.vr
        // }

    }
    interact(){// called onkeyup by input.js
        
        if(this.grabbed == null){
            // grab nearest physicsobject/platform

            var nD = 16; // nearest dist is this (anything above wont be registered, this is the grab limit)
            var nO = null; // nearest object

            for(var i = 0; i < pobjects.length; i++){
                if(pobjects[i].class == 'Player'){continue}
                if(!(pobjects[i].class == 'Platform')){continue}// might remove
                const d = dist(this.x, this.y, pobjects[i].x, pobjects[i].y) - pobjects[i].r
                if(d < nD){nD = d;nO=pobjects[i]}
            }

            if(nO == null){return false}

            this.grabbed = nO;

            const massFactor = this.r*this.r / (this.r*this.r + this.grabbed.r*this.grabbed.r)
            this.vx = this.vx*massFactor + this.grabbed.vx*(1-massFactor)
            this.vy = this.vy*massFactor + this.grabbed.vy*(1-massFactor)
            this.vr = this.vr*massFactor + this.grabbed.vr*(1-massFactor)

        }else{
            const str = (this.r + this.grabbed.r) * this.vr

            this.grabbed.vx+=str*Math.cos(this.rot+1.57)
            this.grabbed.vy+=str*Math.sin(this.rot+1.57)
            this.grabbed.vr += this.vr

            this.grabbed = null;
        }
        return true

    }
    destroy(){
        this.hp = this.maxhp// temp
    }
}

var p;

var entities = []

function iterateFrame(){

    iterateParticles()
    iteratePlanets()
    iteratePhysics()

}