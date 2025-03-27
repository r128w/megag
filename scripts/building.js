class Dock extends Platform {
    constructor(x, y){
        super(x, y, 32)
        this.textureID=1
        this.class='Platform'// acts as platform for all people without class info (ie other players)
        this.dock = true
    }
}