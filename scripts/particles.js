var visuals = []

function iterateVisuals(){
    for(var i = 0; i < visuals.length;i++){
        visuals[i].iterate()
    }
}

function renderVisuals(){
    for(var i = 0; i < visuals.length;i++){
        visuals[i].render()
    }
}

function addParticle(p){
    visuals.push(p)
}

class Visual {
    constructor(x,y,scale,col="#ffffff",lifetime=600){
        this.x = x
        this.y = y
        this.scale = scale
        this.col = col
        this.lifetime=lifetime
        this.age=0
    }
    destroy(){
        visuals.splice(visuals.indexOf(this), 1)
    }
    iterate(){
        this.age++
        if(this.age > this.lifetime){this.destroy()}
    }
    render(){
        drawCircle(this.x, this.y, this.scale * 100, this.col + "33")
    }
}

class Particle extends Visual {
    constructor(x,y,vx,vy,id){

        super(x,y,8)
        this.lifetime = 120
        this.vx = vx
        this.vy = vy

        this.texture = sprites.smoke
        switch(id){
            case 0:
                this.texture = sprites.smoke
                break
        }
    }
    iterate(){
        super.iterate()
        this.x+=this.vx
        this.y+=this.vy
    }
    render(){
        // console.log(this.texture)
        drawSprite(this.texture, this.x, this.y)
    }
}