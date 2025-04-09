class Dock extends Platform {
    constructor(x, y){
        super(x, y, 32)
        this.textureID=1
        this.class='Platform'// acts as platform for all people without class info (ie other players)
        this.dock = true
        this.building = {id:null,progress:null}
    }
    build(id){
        // build a platform
        // 0 - default plat-main
        // 1 - mg mine
        // 2 - no3 mine
        // 3 - selenium mine

        if(this.landed != null || p.landed != null){chat.problem("Cannot build at Dock while grounded.")
            return}

        if(this.building.progress != null || this.building.id != null){return}

        const cost = getBuildCost(id)

        if(p.resources.mg < cost.mg){chat.problem("Not enough Magnesium.")
            return}
        if(p.resources.no3 < cost.no3){chat.problem("Not enough Nitrate.")
            return}
        if(p.resources.se < cost.se){chat.problem("Not enough Selenium.")
            return}

        p.resources.mg-=cost.mg
        p.resources.no3-=cost.no3
        p.resources.se-=cost.se

        this.building.id = id
        this.building.progress = 0
    }
    iterate(){
        super.iterate()
        if(this.building.id!=null){
            this.building.progress ++

            if(this.landed != null || (p.grabbed == this && p.landed != null)){

                const cost = getBuildCost(this.building.id)

                p.resources.mg+=cost.mg*0.5
                p.resources.no3+=cost.no3*0.5
                p.resources.se+=cost.se*0.5
                chat.problem("Build interrupted by landing.")

                this.building.id = null
                this.building.progress = null
            }
        }

        if(this.building.progress > config.buildings.buildtimes[this.building.id]){
            this.building.progress = null
            let nObj;
            switch(this.building.id){
                case 1:nObj = new Mine(this.x, this.y, 'mg');break
                case 2:nObj = new Mine(this.x, this.y, 'no3');break
                case 3:nObj = new Mine(this.x, this.y, 'se');break

                case 4:nObj = new Turret(this.x, this.y, 'gun');break
                case 5:nObj = new Turret(this.x, this.y, 'mini');break

                default:nObj = new Platform(this.x, this.y);break
            }

            const ev = 1; // ejection velocity
            const sd = 0.95 // slowdown factor, so they generally fall inwards from the orbit

            nObj.vx = this.vx * sd
            nObj.vy = this.vy * sd 
            nObj.vr = this.vr
            nObj.vx += ev*(Math.random()-0.5)
            nObj.vy += ev*(Math.random()-0.5)
            nObj.vr += ev*0.25*(Math.random()-0.5)
            pobjects.push(nObj)
            this.building.id = null
        }

        if(p.grabbed == this){
            // console.log('grabbed')

            for(var i = 0; i < config.buildings.binds.length; i++){
                if(config.buildings.binds[i] == input.other){
                    this.build(i)
                    break
                }
            }
        }
    }
    render(){
        super.render()
    }
    renderUI(){// renders the interface with the dock, around building
        if(this.building.id!=null){
            drawBar(this.x, this.y+10, 60, this.building.progress / (config.buildings.buildtimes[this.building.id]))
        }

        if(p.grabbed != this){return}


        ctx.textAlign = "center"
        ctx.font="15px monospace"

        if(this.landed || p.landed){
            const w = 220
            const h = 20
            const x = -w/2
            const y = -h - 50
            ctx.font="12px monospace"
            ui.drawRect(x, y, w, h, "#ffffff66")
            ui.drawText("Cannot build while grounded.", 0, y+15, "#220000")
            return
        }

        // console.log("asd")

        const w = 300
        const h = 200
        const x = -w/2
        const y = -h - 50
        ui.drawRect(x, y, w, h, "#ffffff44")
        const w2 = 140
        const h2 = 20
        ui.drawRect(-w2/2, y - h2, w2, h2, "#ffffff44")

        ui.drawText("Build at Dock", 0, y-3, "#000000")

        const textureIDs = [-1, 2, 4, 6, 8, 9]// ie, default textures (index of appearance in sprites.platforms[])
        const barrels = [-1, -1, -1, -1, 0, 1]// barrel sprite index, much as same fashion as above, -1 == no barrel
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
                const index = i + ii*rows + 1// +1 to skip over base platform
                ctx.font="10px monospace"
                ui.drawText(config.buildings.names[index] || "Locked", x2 + pw/2, y2 + pw - 6, "#000000")
                ui.drawText((config.buildings.binds[index] || "").toUpperCase(), x2 + 5, y2 + 12, "#000000")
                
                const mp = input.mousePos()
                // console.log(mp)
                
                if(mp.x > x2 && mp.x < x2 + pw && mp.y > y2 && mp.y < y2 + pw){
                    //temporary ternary until other buildings added
                    mouseOver = index > config.buildings.names.length - 1 ? -1 : index
                }

                if(textureIDs[index]){
                    const scale = 0.7
                    ctx.drawImage(sprites.platforms[textureIDs[index]], x2 + pw*(1-scale)/2, y2 + pw*(1-scale)/2 - 5, pw*scale, pw*scale)
                    if(barrels[index]!=-1){
                        ctx.drawImage(sprites.barrels[barrels[index]], x2 + pw*(1-scale)/2, y2 + pw*(1-scale)/2 - 5, pw*scale, pw*scale)
                    }
                }
            }
        }

        if(mouseOver != -1){
            const mp = input.mousePos()
            ui.drawRect(mp.x, mp.y, pw, pw*0.6, "#00000044")
            ui.drawText(config.buildings.names[mouseOver], mp.x + pw/2, mp.y + 15, "#ffffff")
            const cost = getBuildCost(mouseOver)
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
            if(input.mc && this.building.id==null){
                this.build(mouseOver)
            }
        }



    }
}

function getBuildCost(index){
    const m = config.buildings.reqs[index].mg || 0
    const n = config.buildings.reqs[index].no3 || 0
    const s = config.buildings.reqs[index].se || 0
    return {
        mg:m,
        no3:n,
        se:s
    }
}