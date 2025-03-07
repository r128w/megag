
window.onresize()

var menuTimer;
function initMenu(){
    menuTimer = setInterval(runMenu, 16)
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
