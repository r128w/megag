
window.onresize()

var menuTimer;
function initMenu(){
    menuTimer = setInterval(runMenu, 16)
    menu = {
        ps:[],
        vx:Math.random()-0.5,
        vy:Math.random()-0.5,
        maxr:c.height/8
    }
    for(var i = 15; i >= 0; i --){
        menu.ps.push({x:Math.random()*3*c.width-c.width, y:Math.random()*3*c.height-c.height, r:(menu.maxr/(Math.pow(2, 0.1*i)))})
    }
}

function initGame(){

    clearTimeout(menuTimer)

    pobjects = [];
    planets = [];

    pobjects.push(new Player(-200, -200, 16))
    p = pobjects[0]
    
    //temp
    pobjects.push(new Platform(-800, -900))

    planets.push(new Planet(0, 0, 800, '#99eeaa'))// starts

    for(var i = 0; i < 10; i++){
        planets.push(new Planet(
            (Math.random()-0.5)*10000, (Math.random()-0.5)*10000, (Math.random())*500+50
        ))
    }
    

    loadSprites()
    frameTimer = setInterval(runFrame, 16)
}


var frameTimer;

function runFrame(){

    iterateFrame()
    renderFrame()
}
function halt(){clearTimeout(frameTimer)}


// initGame()
initMenu()
