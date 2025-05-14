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
        this.br = 0// blast radius

    }
    iterate(){

        if(this.dead){return}
        
        iterateThing(this)
        // if(this.age > this.lifetime || this.landed){
        //     this.destroy()
        // }
    }
    destroy(){
        if(this.dead){return}
        if(this.br){Bullet.detonate(this)}
        super.destroy()
    }
    static detonate(o){//visual only
        visuals.add(new Explosion(o.x, o.y, o.br))
        particles.burst(o.x, o.y, 12, 5)
    }

}

function renderBullets(){
        // bullets, just copypasted platform renderer
       for(var i = 0; i < pobjects.length;i++){
           if(pobjects[i].class == 'Bullet'){
                if(pobjects[i].dead){continue}
               drawSpriteRot(sprites.bullets[pobjects[i].textureID], pobjects[i].x, pobjects[i].y, pobjects[i].rot)
           }
       }
       for(var i = 0; i < config.playerMax; i++){
           if(!sync.conns[i].open){continue}
           for(var ii = 0; ii < sync.others[i].obj.length;ii++){
               let obj = sync.others[i].obj[ii]
               if(obj.class == 'Bullet'){
                if(obj.dead){continue}
                   drawSpriteRot(sprites.bullets[obj.textureID], obj.x, obj.y, obj.rot)
               }
           }
        }
}

class AmmoFactory extends Platform {
    constructor(x,y){
        super(x, y, 24)
        this.textureID = 9 // temp id until custom sprite made
        this.options = [1, 2, 3, 4, 5, 6]// 0 is base bullet
    }
    iterate(){
        super.iterate()


        if(p.grabbed == this){// stolen from dock

            const other = (input.other()||"").toLowerCase()

            for(var i = 0; i < config.buildings.binds.length; i++){
                if(config.buildings.binds[i] == other){
                    this.make(this.options[i])
                    break
                }
            }
        }
    }
    renderUI(){// much is stolen from the dock renderui
        super.renderUI()
        if(p.grabbed != this){return}

        ctx.textAlign = "center"
        ctx.font="15px monospace"

        if(this.landed || p.landed){
            const w = 240
            const h = 20
            const x = -w/2
            const y = -h - 50
            ctx.font="12px monospace"
            ui.drawRect(x, y, w, h, "#ffffff66")
            ui.drawText("Cannot make ammo while grounded.", 0, y+15, "#220000")
            return
        }

        const w = 300
        const h = 200
        const x = -w/2
        const y = -h - 50
        ui.drawRect(x, y, w, h, "#ffffff44")
        const w2 = 100
        const h2 = 20
        ui.drawRect(-w2/2, y - h2, w2, h2, "#ffffff44")

        ui.drawText("Make Ammo", 0, y-3, "#000000")

        // ignore base platform

        // each build panel should be 100x100

        const margin = 5;
        const pw = 100 - margin*2
        const rows = 3

        let mouseOver = -1

        for(var i = 0; i < rows; i ++){
            for(var ii = 0; ii < 2; ii ++){
                const x2 = x + i*(pw + margin*2) + margin
                const y2 = y + ii*(pw + margin*2) + margin
                ui.drawRect(x2, y2, pw, pw, "#ffffff22")
                const index = this.options[i + ii*rows]
                ctx.font="10px monospace"
                let toWrite = (config.bulstats[index] || {name:"Locked"}).name
                if(toWrite!='Locked'){toWrite+=` x${config.bulstats[index].make.amount}`}
                ui.drawText(toWrite, x2 + pw/2, y2 + pw - 6, "#000000")
                ui.drawText((config.buildings.binds[i + ii*rows] || "").toUpperCase(), x2 + 5, y2 + 12, "#000000")

                if(!config.bulstats[index]){continue}
                
                const mp = input.mousePos()

                if(mp.x > x2 && mp.x < x2 + pw && mp.y > y2 && mp.y < y2 + pw){
                    mouseOver = index
                }

                if(config.bulstats[index]){
                    const scale = 0.7
                    ctx.globalAlpha = 0.7
                    ctx.drawImage(
                        sprites.bulicons, 
                        index*16,0,16,16,
                        x2 + pw*(1-scale)/2, y2 + pw*(1-scale)/2 - 5, pw*scale, pw*scale)
                    ctx.globalAlpha = 1
                }
            }
        }

        if(mouseOver != -1){
            const mp = input.mousePos()
            ui.drawRect(mp.x, mp.y, pw, pw*0.7, "#00000044")
            ui.drawText(config.bulstats[mouseOver].name, mp.x + pw/2, mp.y + 15, "#ffffff")
            const cost = config.bulstats[mouseOver].make.cost
            let a = 2
            if(cost.mg > 0){
                ui.drawText("Mg: " + cost.mg, mp.x + pw/2, mp.y + 15*a, config.resources.colors.mg)
                a++
            }
            if(cost.no3 > 0){
                ui.drawText("NO3: " + cost.no3, mp.x + pw/2, mp.y + 15*a, config.resources.colors.no3)
                a++
            }
            if(cost.se > 0){
                ui.drawText("Se: " + cost.se, mp.x + pw/2, mp.y + 15*a, config.resources.colors.se)
                a++
            }
            if(input.mc()){
                this.make(mouseOver)
            }
        }
    }
    make(id){
        if(config.bulstats[id]){
            // todo
            console.log('make', id)
            const cost = config.bulstats[id].make.cost
            if(cost.mg>p.resources.mg){chat.problem('Not enough Magnesium.');return}
            if(cost.no3>p.resources.no3){chat.problem('Not enough Nitrate.');return}
            if(cost.se>p.resources.se){chat.problem('Not enough Selenium.');return}

            if(cost.mg > 0){p.resources.mg -= cost.mg}
            if(cost.no3 > 0){p.resources.no3 -= cost.no3}
            if(cost.se > 0){p.resources.se -= cost.se}

            p.stuff.ammo[id] = (p.stuff.ammo[id] || 0) + config.bulstats[id].make.amount

        }
    }
}