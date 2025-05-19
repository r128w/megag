class Laser extends Visual {
    // only visual sent to others, hit collisions etc done on sender's side
    constructor(x, y, angle, distance=1000, thickness=25, col="#ffffff"){

        super(x,y,thickness,col)

        this.dx = Math.cos(angle)
        this.dy = Math.sin(angle)

        this.distance = distance
        this.damage = 3

        this.src = 0

        this.class = 'Laser'

    }
    iterate(){
        
        if(this.scale <= 0){
            this.destroy()
        }
        if(this.scale){
            // this should be run for all non-this client lasers
            if(this.src != sync.self.id){
                // console.log(this.src)
                for(var i = 0; i < pobjects.length; i++){
                    let o = pobjects[i]
                    let dot = ((o.x-this.x)*(this.dx*this.distance) + (o.y-this.y)*(this.dy*this.distance))
                    let ddot = dot/(this.distance*this.distance)
                    if(ddot > 0 && ddot < 1){// vector projection to check if its within line
                        // find dist from line -> magnitude of (o-this) - proj_this(o-this)
                        let x = (o.x-this.x) - ddot*(this.dx*this.distance)
                        let y = (o.y-this.y) - ddot*(this.dy*this.distance)
                        let magdist = Math.sqrt(x*x+y*y)
                        if(magdist < this.scale + o.r){
                            // damage
                            // console.log(o)
                            o.hp -= this.damage
                        }
                    }
                }
            }
        }
        this.scale -= 1.05
    }
    render(){
        ctx.lineWidth = this.scale
        ctx.strokeStyle=this.col+'66'
        ctx.beginPath()
        ctx.moveTo(this.x + cam.xo, this.y + cam.yo)
        ctx.lineTo(this.x + cam.xo + this.distance*this.dx, this.y + cam.yo + this.distance*this.dy)
        ctx.stroke()
        ctx.lineWidth = this.scale*0.5
        ctx.strokeStyle="#ffffff99"
        ctx.beginPath()
        ctx.moveTo(this.x + cam.xo, this.y + cam.yo)
        ctx.lineTo(this.x + cam.xo + this.distance*this.dx, this.y + cam.yo + this.distance*this.dy)
        ctx.stroke()
    }
    static fromJSON(json){
        const obj = new Laser(json.x, json.y, Math.atan2(json.dy, json.dx), json.distance, json.scale, json.col)
        obj.id = json.id
        obj.class = "Laser"
        obj.damage = json.damage
        obj.src = json.src
        obj.age = json.age
        obj.lifetime = json.lifetime
        return obj
    }
}