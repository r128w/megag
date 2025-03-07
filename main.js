
window.onresize()


function initMenu(){
    runMenu()
}

function initGame(){

    pobjects.push(new Player(-200, -200, 16))
    p = pobjects[0]
    
    //temp
    pobjects.push(new Platform(-800, -900))

    planets.push(new Planet(0, 0, 800, '#99eeaa'))// start
    

    loadSprites()
    runFrame()
}


var frameTimer;

function runFrame(){

    iterateFrame()
    renderFrame()

    frameTimer = setTimeout(runFrame, 16)
}
function halt(){clearTimeout(frameTimer)}


// initGame()
initMenu()