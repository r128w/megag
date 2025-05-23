var planets = []

class Planet {
    constructor(x, y, r, col="#99eeaa") {
        this.x = x;
        this.y = y;
        this.r = r;
        this.mass = r*r;
        this.col = col
        this.name = nameGen()
        this.resources = {
            mg:0,
            no3:0,
            se:0,
        }
    }
}

function iteratePlanets(){
    // console.log(Date.now()%1000)
    for(var i = 0; i < planets.length; i ++){
        const pl = planets[i]
        if(Date.now() % config.resources.genPeriod > 5*pl.r){continue}
        if(Date.now() % 101 < 1){// could add more versatile config, but this is prob fine
            if(pl.resources.mg < pl.r * config.resources.mgMax){pl.resources.mg+=1}
            continue
        }
        if(Date.now() % 126 < 1){
            if(pl.resources.no3 < pl.r * config.resources.no3Max){pl.resources.no3+=1}
            continue
        }
        if(Date.now() % 221 < 1){
            if(pl.resources.se < pl.r * config.resources.seMax){pl.resources.se+=1}
        }
    }
}


function renderPlanets(){
    for(var i = 0; i < planets.length;i++){
        drawCircle(planets[i].x, planets[i].y, planets[i].r, planets[i].col)
    }
}

function generatePlanets(){

    planets.push(new Planet(0, 0, 400, '#99eeaa'))// starting planet
    planets[0].name = "Spawn"

    while(planets.length < config.worldGen.numPlanets){

        if(planets.length < config.worldGen.numPlanets * 0.5){
            let valid = true
            for(var i = 0; i < 10; i ++){
                let x = (Math.random()-0.5) * 2 * config.worldGen.initSpread
                let y = (Math.random()-0.5) * 2 * config.worldGen.initSpread
                let valid2 = true
                for(var ii = 0; ii < planets.length ;ii ++){
                    if(dist(planets[ii].x, planets[ii].y, x, y) < config.worldGen.minSpacing + planets[ii].r){
                        valid2=false;break
                    }
                }
                if(valid2){valid=true
                    planets.push(new Planet(x, y, 
                        config.worldGen.minPSize + Math.random()*(config.worldGen.maxPSize-config.worldGen.minPSize), 
                        color.colGen()))
                    break
                }
            }
        }

        let baseP = chooseRandom(planets)

        let angle = Math.random()*360// radians :-)

        let spacing = config.worldGen.spacing * baseP.r/((config.worldGen.maxPSize-config.worldGen.minPSize)/2)

        let x = baseP.x + spacing * Math.cos(angle)
        let y = baseP.y + spacing * Math.sin(angle)


        for(var i = 0; i < 15; i ++){// 15 tries

            angle = Math.random()*360// radians :-)

            x = baseP.x + spacing * Math.cos(angle)
            y = baseP.y + spacing * Math.sin(angle)

            let valid = true

            for(var ii = 0; ii < planets.length ;ii ++){
                // console.log(config.worldGen.minSpacing + (planets[ii].r * config.planetInfluenceFactor))
                if(dist(planets[ii].x, planets[ii].y, x, y) < 
                    config.worldGen.minSpacing + (planets[ii].r * config.planetInfluenceFactor)
                ){
                    valid=false;break
                }
            }
            spacing *= 1.1
            if(valid){break}
        }

        planets.push(new Planet(x, y, 
            config.worldGen.minPSize + Math.random()*(config.worldGen.maxPSize-config.worldGen.minPSize)
            , color.colGen()))
    }
}