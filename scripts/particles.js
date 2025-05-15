
function iterateVisuals(){
    for(var i = 0; i < visuals.list.length;i++){
        visuals.list[i].iterate()
    }
}

function renderVisuals(){
    for(var i = 0; i < visuals.list.length;i++){
        visuals.list[i].render()
    }
}

var particles = {
    add:function(p){
        visuals.list.push(p)
    },
    burst:function(x,y,amount=20, speed=4){
        for(var i = 0; i < amount; i ++){
            const angle = Math.random()*360//radians
            const s = Math.random()*speed
            this.add(new Particle(
                x,
                y,
                s*Math.cos(angle),
                s*Math.sin(angle),
            ))
        }
    }
}

class Visual {
    constructor(x,y,scale,col="#ffffff",lifetime=600){
        this.x = x
        this.y = y
        this.scale = scale
        this.col = col
        this.lifetime=lifetime
        this.age=0
        this.id = Date.now()-Math.trunc(Math.random()*100000000)// same as physicsobject
    }
    destroy(){
        visuals.list.splice(visuals.list.indexOf(this), 1)
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
        drawSprite(this.texture, this.x, this.y)
    }
}

class Explosion extends Visual {
    constructor(x, y, size, col=color.warm(), speed=3){
        super(x,y,size,col)
        this.size = size
        this.speed = speed
        this.lifetime = size/speed
        this.class = "Explosion"
    }
    iterate(){
        super.iterate()
        this.size-=this.speed
    }
    render(){
        drawCircle(this.x, this.y, this.size, this.col + "33")
    }
    static fromJSON(json){
        const obj = new Explosion(json.x, json.y, json.size, json.col, json.speed)
        obj.id = json.id
        obj.class = "Explosion"
        return obj
    }
}

var visuals = {
    list:[],
    add:function(v, external=false){
        // external is whether it came from others(to avoid infinite looping visuals from one to one)
        let toAdd = v;
        if(toAdd instanceof Explosion){this._add(toAdd,external)}
        if(v.class == "Explosion"){
            toAdd = Explosion.fromJSON(v)
        }
        if(toAdd){this._add(toAdd,external)}
    },
    _add:function(v, external=false){
        for(var i = 0; i < this.list.length; i ++){
            if(this.list[i].id == v.id){return}
        }
        this.list.push(v)
        if(!external){smallUpdate(v, 4)}
    }
}