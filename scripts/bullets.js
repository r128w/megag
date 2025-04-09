class Bullet extends PhysicsObject {

    constructor(x, y, vx, vy, id=0, expiry=600){
        super(x,y,5)
        this.class = 'Bullet'
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.r = 5
        this.textureID = id
        this.lifetime = expiry
        this.age = 0
        this.damage = 1

    }
    iterate(){
        iterateThing(this)
        if(this.age > this.lifetime || this.landed || this.x < -config.systemSize){
            this.destroy()
        }
    }

}

function renderBullets(){
        // bullets, just copypasted platform renderer
       for(var i = 0; i < pobjects.length;i++){
           if(pobjects[i].class == 'Bullet'){
               drawSpriteRot(sprites.bullets[pobjects[i].textureID], pobjects[i].x, pobjects[i].y, pobjects[i].rot)
           }
       }
       for(var i = 0; i < config.playerMax; i++){
           if(!sync.conns[i].open){continue}
           for(var ii = 0; ii < sync.others[i].obj.length;ii++){
               let obj = sync.others[i].obj[ii]
               if(obj.class == 'Bullet'){
                   drawSpriteRot(sprites.bullets[obj.textureID], obj.x, obj.y, obj.rot)
               }
           }
        }
}