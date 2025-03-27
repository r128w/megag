// platforms: orbiting objects
// like turrets

class Platform extends PhysicsObject{
    constructor(x, y, r=8){// circular, 16px wide = 8px radius
        super(x, y, r)
        this.textureID = 0
        this.col = "#ffffff" // used on minimap, placeholder stuff
        this.class = 'Platform'
    }
}

function renderPlatforms(){
     // platforms
    for(var i = 0; i < pobjects.length;i++){
        if(pobjects[i].class == 'Platform'){
            pobjects[i].col = p.col
            drawSpriteRot(sprites.platforms[pobjects[i].textureID], pobjects[i].x, pobjects[i].y, pobjects[i].rot, pobjects[i].r)
        }
    }
    for(var i = 0; i < config.playerMax; i++){
        if(!sync.conns[i].open){continue}
        for(var ii = 0; ii < sync.others[i].obj.length;ii++){
            let obj = sync.others[i].obj[ii]
            if(obj.class == 'Platform'){
                drawSpriteRot(sprites.platforms[obj.textureID], obj.x, obj.y, obj.rot, obj.r)
            }
        }
    }
}

class Mine extends Platform{
    constructor (x,y,resource){
        super(x, y, 16)
        this.resource = resource
        this.stored = 0
    }
    iterate(){
        super.iterate()
        if(this.landed == null){return}
        if(Date.now()%1000 < 12){
            if(this.landed.resources[this.resource] > 4 && Math.random() < 0.2){
                this.stored+=5;this.landed.resources[this.resource]-=5
            }
            smallUpdate({id:planets.indexOf(this.landed), value:this.landed.resources}, 3)// sync resource amount betwixt players (one shared resource pool)
            // this may cause weirdness race conditions etc when two things mining but its chill, nobody cares
        }
        // doesnt matter that resources only collect when on the ground, since this will never be relevant
        if(dist(p.x, p.y, this.x, this.y) < this.r+p.r+15){
            p.resources[this.resource] += this.stored
            this.stored = 0
        }
    }
}