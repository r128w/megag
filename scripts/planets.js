var planets = []

class Planet {
    constructor(x, y, r, col="#99eeaa") {
        this.x = x;
        this.y = y;
        this.r = r;
        this.mass = r*r;
        this.col = col;
        this.name = nameGen()
        this.resources = {
            mg:0,
            no3:0,
            se:0,
        }
    }
}

function iteratePlanets(){
    for(var i = 0; i < planets.length; i ++){
        const pl = planets[i]
        if(Date.now() % 1000 > 5*pl.r){continue}
        if(Date.now() % 100 < 1){
            if(pl.resources.mg < pl.r){pl.resources.mg+=1}
            continue
        }
        if(Date.now() % 1000 < 8){
            if(pl.resources.no3 < pl.r*0.8){pl.resources.no3+=1}
            continue
        }
        if(Date.now() % 1000 < 5){
            if(pl.resources.se < pl.r*0.5){pl.resources.se+=1}
        }
    }
}


function renderPlanets(){
    for(var i = 0; i < planets.length;i++){
        drawCircle(planets[i].x, planets[i].y, planets[i].r, planets[i].col)
    }
}

function generatePlanets(){
    planets.push(new Planet(0, 0, 600, '#99eeaa'))// starts

    for(var i = 0; i < 10; i++){
        planets.push(new Planet(
            (Math.random()-0.5)*15000, (Math.random()-0.5)*15000, (Math.random())*500+50
        ))
    }
}