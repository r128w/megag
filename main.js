
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
    pobjects.push(new Platform(-800, -900))
    pobjects[1].col = p.col


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