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

        const m = config.buildings.reqs[id].mg || 0
        const n = config.buildings.reqs[id].no3 || 0
        const s = config.buildings.reqs[id].se || 0

        if(p.resources.mg < m){chat.problem("Not enough Magnesium.")
            return}
        if(p.resources.no3 < n){chat.problem("Not enough Nitrate.")
            return}
        if(p.resources.se < s){chat.problem("Not enough Selenium.")
            return}

        p.resources.mg-=m
        p.resources.no3-=n
        p.resources.se-=s

        this.building.id = id
        this.building.progress = 0
    }
    iterate(){
        super.iterate()
        if(this.building.id!=null){
            this.building.progress ++

            if(this.landed != null || (p.grabbed == this && p.landed != null)){

                const m = config.buildings.reqs[this.building.id].mg || 0
                const n = config.buildings.reqs[this.building.id].no3 || 0
                const s = config.buildings.reqs[this.building.id].se || 0

                p.resources.mg+=m*0.5
                p.resources.no3+=n*0.5
                p.resources.se+=s*0.5
                chat.problem("Build interrupted by landing.")

                this.building.id = null
                this.building.progress = null
            }
        }

        if(this.building.progress > 100){
            this.building.progress = null
            const ev = 1; // ejection velocity
            let nObj;
            switch(this.building.id){
                case 1:nObj = new Mine(this.x, this.y, 'mg');break
                case 2:nObj = new Mine(this.x, this.y, 'no3');break
                case 3:nObj = new Mine(this.x, this.y, 'se');break

                default:nObj = new Platform(this.x, this.y);break
            }
            nObj.vx = this.vx
            nObj.vy = this.vy
            nObj.vr = this.vr
            nObj.vx += ev*(Math.random()-0.5)
            nObj.vy += ev*(Math.random()-0.5)
            nObj.vr += ev*0.25*(Math.random()-0.5)
            pobjects.push(nObj)
            this.building.id = null
        }

        if(p.grabbed == this){
            // console.log('grabbed')

            switch(input.other){
                case't':this.build(1);break
                case'y':this.build(2);break
                case'u':this.build(3);break
            }
        }
    }
    renderUI(){// renders

    }
}