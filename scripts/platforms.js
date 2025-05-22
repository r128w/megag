// platforms: orbiting objects
// like turrets

class Platform extends PhysicsObject{
    constructor(x, y, r=8, vx = 0, vy=0){// circular, 16px wide = 8px radius
        super(x, y, r)
        this.textureID = 0
        this.col = "#ffffff" // used on minimap, placeholder stuff
        this.class = 'Platform'
        this.vx = 0
        this.vy = 0
        this.platformID = 0
        this.maxhp = 10
        this.hp = 100
    }
    renderUI(){
        // health bar
        if(this.hp != this.maxhp){
            drawBar(this.x, this.y+this.r+5, 50, this.hp/this.maxhp,"#666666",this.col)
        }
    }
    render(){
        drawSpriteRot(sprites.platforms[this.textureID], this.x, this.y, this.rot, this.r)
    }
    iterate(){

        this.col = p.col
        if(this.hp > this.maxhp){this.hp = this.maxhp}

        super.iterate()
        // dummy method
    }
}

function renderPlatforms(){
     // platforms
    for(var i = 0; i < pobjects.length;i++){
        if(pobjects[i].class == 'Platform'){
            pobjects[i].render()
        }
    }

    for(var i = 0; i < config.playerMax; i++){
        if(!sync.conns[i].open){continue}
        for(var ii = 0; ii < sync.others[i].obj.length;ii++){
            let obj = sync.others[i].obj[ii]
            if(obj.class == 'Platform'){
                drawCircle(
                    obj.x, obj.y, obj.r * 1.414, obj.col+"44"// root two, opacity
                )// render silhouette of other player's color
                drawSpriteRot(sprites.platforms[obj.textureID], obj.x, obj.y, obj.rot, obj.r)
                if(obj.tr){
                    drawSpriteRot(sprites.barrels[obj.ttextureID], obj.x, obj.y, obj.tr, obj.r)
                }
            }
        }
    }
}

function renderPlatformUI(){
    // platforms
    for(var i = 0; i < pobjects.length;i++){
        if(pobjects[i].class == 'Platform'){
            pobjects[i].renderUI()
        }
    }
    for(var i = 0; i < config.playerMax; i++){
        if(!sync.conns[i].open){continue}
        for(var ii = 0; ii < sync.others[i].obj.length;ii++){
            let obj = sync.others[i].obj[ii]
            if(obj.class == 'Platform'){
                if(obj.hp != obj.maxhp){
                    drawBar(obj.x, obj.y+obj.r+5, 50, obj.hp/obj.maxhp,"#666666", obj.col)
                }
            }
        }
    }
}

class Mine extends Platform{
    constructor(x,y,resource){
        super(x, y, 16)
        this.resource = resource
        this.maxhp = 6
        this.hp = 6
        this.stored = 0
        switch(resource){
            case 'mg':this.textureID=2;this.platformID=1;break
            case 'no3':this.textureID=4;this.platformID=2;break
            case 'se':this.textureID=6;this.platformID=3;break
        }
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
        if(Date.now() % 2000 < (this.stored * 10) + 300){
            this.textureID=this.platformID*2+1 // go up to full texture
        }else{
            this.textureID=this.platformID*2
        }
        // doesnt matter that resources only collect when on the ground, since this will never be relevant
        if(dist(p.x, p.y, this.x, this.y) < this.r+p.r+15){
            p.resources[this.resource] += this.stored
            this.stored = 0
            this.textureID=this.platformID*2
        }
    }
}

class Turret extends Platform{

    constructor (x, y, type='gun'){
        super(x,y,16)

        this.maxhp = 10
        this.hp = 10

        this.shoot = config.bulstats[0]

        this.tr = 0 // turret rotation
        this.ttextureID = 0

        this.textureID = 8

        switch(type){
            case'gun':break
            case'mini':
            this.shoot = config.bulstats[1]
            this.textureID = 0
            this.r = 8
            this.ttextureID = 1
            break
            case'laser':
            this.shoot = config.bulstats[3]
            this.textureID = 15
            this.ttextureID = 2
            break
        }

    }

    render(){
        super.render()

        drawSpriteRot(sprites.barrels[this.ttextureID], this.x, this.y, this.tr, this.r)
    }

    iterate(){
        super.iterate()
        this.shoot.cooldown = (this.shoot.cooldown || 0)-1


        // find targets
        // aim
        var targets = []

        for(var i = 0; i < config.playerMax; i++){
            if(!sync.conns[i].open){continue}
            for(var ii = 0; ii < sync.others[i].obj.length;ii++){
                let obj = sync.others[i].obj[ii]
                if(obj.class == 'Player' || obj.class == 'Platform'){
                    targets.push(obj)
                }
            }
        }


        let best = null
        let bestdist = this.shoot.range

        for(var i = 0; i < targets.length; i ++){
            let cur = dist(targets[i].x, targets[i].y, this.x, this.y)
            if(cur < bestdist){
                best = targets[i]
                bestdist = cur
            }
        }
        // console.log(best)

        if(best == null){
            this.tr += 0.01 // idling

            return
        }

        // im on a whole nother level im geeking

        const delay = (0.7*(bestdist / ((this.shoot.iv) || 1000)))// naive leading

        this.tr = Math.atan2(best.y + delay*best.vy - this.y - this.vx*delay, best.x + delay*best.vx - this.x - this.vx*delay)

        if(this.shoot.cooldown <= 0){
            shootBullet(this.x + Math.cos(this.tr)*this.r
                , this.y + Math.sin(this.tr)*this.r
                , this.vx, this.vy, this.tr, this.shoot)
            this.shoot.cooldown = this.shoot.firerate
            // const sr = this.tr + (this.shoot.spread || 0)
            // this.shoot.cooldown = this.shoot.firerate
            // const dx = Math.cos(sr)
            // const dy = Math.sin(sr)
            // const b = new Bullet(this.x+this.r*dx, this.y+this.r*dy, this.vx+this.shoot.iv*dx, this.vy+this.shoot.iv*dy)
            // b.rot = sr
            // b.damage = this.shoot.damage
            // pobjects.push(b)
            // smallUpdate(b)// tell everyone about this shiny new thing
        }
    }

}