
window.onresize()

loadSprites()

async function initGame(multiplayer=true){

    clearTimeout(menuTimer)

    pobjects = [];
    planets = [];


    const angle = Math.random()*360;// angle is in radians

    pobjects.push(new Player(800 * Math.cos(angle), 800 * Math.sin(angle)))
    pobjects.push(new Dock(1000 * Math.cos(angle+0.1), 1000 * Math.sin(angle+0.1)))

    for(var i = 0; i < pobjects.length; i ++){// give the starting objects some random nudges
        pobjects[i].vr = 0.01 * (Math.random()-0.5)
        pobjects[i].rot = angle
        pobjects[i].vx = Math.random()-0.5
        pobjects[i].vy = Math.random()-0.5
    }

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

loadUserInfo()
initMenu()