// platforms: orbiting objects
// like turrets

class Platform extends PhysicsObject{
    constructor(x, y){// circular, 16px wide = 8px radius
        super(x, y, 8)
        this.textureID = 0
        this.col = "#ffffff" // used on minimap, placeholder stuff
    }
}

function renderPlatforms(){
     // platforms
     for(var i = 0; i < pobjects.length;i++){
        if(pobjects[i] instanceof Platform){
            drawSpriteRot(sprites.platforms[pobjects[i].textureID], pobjects[i].x, pobjects[i].y, pobjects[i].rot)
        }
    }
}
