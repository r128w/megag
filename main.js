
window.onresize()

async function initGame(multiplayer=true){

    clearTimeout(menuTimer)

    pobjects = [];
    planets = [];

    pobjects.push(new Player(Math.random()-0.5, Math.random()-0.5))
    p = pobjects[0]

    updateUserInfo()

    if(multiplayer){
        chat.system("Joined Multiplayer")
        await initSync()

        generatePlanets()// this will get overriden if not alone

    }else{
        chat.system("Joined Singleplayer")
        initEmptySync()
        generatePlanets()
    }

    //temp
    let angle = Math.random()*360;// angle is in radians
    pobjects.push(new Dock(1000 * Math.cos(angle), 1000 * Math.sin(angle)))


    loadSprites()

    lastFrame = Date.now()
    frameTimer = setInterval(runFrame, 16)

}


var frameTimer;

var lastFrame;

function runFrame(){

    let dt = Date.now()-lastFrame

    if(dt > 100){
        console.log('frame stuttering, usability may suffer')
    }
    
    for(var i = 0; i < dt / 16 && i < 60; i++){// run additional frames, ensuring no more than 60 (1 second catchup)
        iterateFrame()
    }

    renderFrame()
    lastFrame = Date.now()

}
function halt(){clearTimeout(frameTimer)}


// initGame()

loadUserInfo()
initMenu()