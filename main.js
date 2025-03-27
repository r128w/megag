
window.onresize()

async function initGame(multiplayer=true){

    clearTimeout(menuTimer)

    pobjects = [];
    planets = [];

    pobjects.push(new Player(-200, -200, 16))
    p = pobjects[0]

    updateUserInfo()

    if(multiplayer){
        await initSync()

        generatePlanets()// this will get overriden if not alone

    }else{
        initEmptySync()
        generatePlanets()
    }

    //temp
    pobjects.push(new Dock(-800, -900))
    pobjects.push(new Mine(-600, -900, 'mg'))


    loadSprites()

    lastFrame = Date.now()
    frameTimer = setInterval(runFrame, 16)

}


var frameTimer;

var lastFrame;

function runFrame(){

    let dt = Date.now()-lastFrame
    for(var i = 0; i < dt / 16 && i < 60; i++){// run additional frames, ensuring no more than 60

    iterateFrame()
    }

    renderFrame()
    lastFrame = Date.now()

}
function halt(){clearTimeout(frameTimer)}


// initGame()

loadUserInfo()
initMenu()