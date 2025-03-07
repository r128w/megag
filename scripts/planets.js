var planets = []

class Planet {
    constructor(x, y, r, col="#99eeaa") {
        this.x = x;
        this.y = y;
        this.r = r;
        this.mass = r*r;
        this.col = col;
    }
}


for(var i = 0; i < 10; i++){
    planets.push(new Planet(
        (Math.random()-0.5)*10000, (Math.random()-0.5)*10000, (Math.random())*500+50
    ))
}


function renderPlanets(){
    for(var i = 0; i < planets.length;i++){
        drawCircle(planets[i].x, planets[i].y, planets[i].r, planets[i].col)
    }
}