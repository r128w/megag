// platforms: orbiting objects
// like turrets

class Platform extends PhysicsObject{
    constructor(x, y){// circular, 16px wide = 8px radius
        super(x, y, 8)
        this.textureID = 0
        this.col = "#ffffff" // used on minimap, placeholder stuff
        this.class = 'Platform'
    }
}

function renderPlatforms(){
     // platforms
    for(var i = 0; i < pobjects.length;i++){
        if(pobjects[i].class == 'Platform'){
            drawSpriteRot(sprites.platforms[pobjects[i].textureID], pobjects[i].x, pobjects[i].y, pobjects[i].rot)
        }
    }
    for(var i = 0; i < config.playerMax; i++){
        if(!sync.conns[i].open){continue}
        for(var ii = 0; ii < sync.others[i].obj.length;ii++){
            let obj = sync.others[i].obj[ii]
            if(obj.class == 'Platform'){
                drawSpriteRot(sprites.platforms[obj.textureID], obj.x, obj.y, obj.rot)
            }
        }
    }

}
