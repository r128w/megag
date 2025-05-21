const baseconfig = {
    version:3,
    minimap:{
        drawPlanetInfluence: 8, // transparency (out of 255)
        pathPredictions:100,
        pathPredictionResolution:10,
        hellaZoom:false
    },
    resources:{
        mgMax:1,
        no3Max:0.8,
        seMax:0.3,
        genPeriod:2081,// higher == less frequent, highly recommended to be prime or somewhat prime
        colors:{mg:"#eeddff",no3:"#ffddaa",se:"#ddffdd"}
    },
    bigG: 0.1,
    worldGen:{
        numPlanets:14,
        spacing:1200,
        minSpacing:500,
        minPSize:200,
        maxPSize:600,
        initSpread:9000
    },
    gravLimit: 5000,
    planetInfluenceFactor: 5,
    playerMax: 10,
    systemSize:30000,// how far out before things are deleted
    sync:{
        updateInterval: 150, // might make this adjustable easily
        reconnectInterval: 10000,
        smallInterval: 50 // for individual objects
    },
    chatLength:128,
    buildings:{
        names:["Base Platform", "Magnesium Mine", "Nitrate Farm", "Selenium Mine", "Basic Turret", // ids 0-4
            "Miniturret", "Ammo Factory", "Turret Dock", "Defense Dock", "Local Shield", // 5-9
            "Regional Shield","Planetary Shield", "Laser Turret"],// 10-14
        reqs:[{mg:10,no3:5}, {mg:40,no3:50}, {mg:50,no3:40}, {mg:100,no3:120}, {mg:200,no3:150}, 
            {mg:50,no3:25,se:75}, {mg:75,no3:10,se:25}, {mg:50,no3:80}, {mg:80,no3:50}, {mg:20,se:60},
            {mg:45,se:125}, {mg:150,no3:5,se:175}, {mg:120, se:150}],
        buildtimes:[120, 480, 480, 960, 480,
            1080, 960, 960, 960, 480,
            1080, 1280, 1080],
        binds:['y', 'u', 'i', 'h', 'j', 'k'],// shared between all docks/menus
        previews:[-1, 2, 4, 6, 8,
            0, 9, 10, 11, 12,
            13, 14, 8],// preview sprites for build menu
        previewb:[-1, -1, -1, -1, 0,
            1, -1, -1, -1, -1,
            -1, -1, 0],// preview barrels
        stats:{// misc stats
            9:{maxhp:10, r:100, col:'#66aaee'},// local shield
            10:{maxhp:15, r:200, col:'#66aaee'},// large local shield
            11:{maxhp:20, r:150, col:'#66aaee'}// planetary shield
        }
    },
    bulstats:[
        {// base bullet
            firerate: 25, // actually a cooldown
            damage: 0.5,
            range: 400,
            iv: 6,
            name: "Bullet",
            textureID:0,
            id:0,
            make:{cost:null,amount:null},
        },
        {// minigun bullet
            firerate:3,damage:0.1,range:300,iv:8,spread:0.3,name:"Minigun",textureID:0,id:1,
            make:{cost:{mg:25,no3:30},amount:75}
        },
        {// bomb
            firerate:60,damage:10,range:300,iv:2,spread:1,name:"Bomb",textureID:1,br:50,id:2,
            make:{cost:{mg:10,no3:50},amount:5}
        },
        {// laser charge
            firerate:60,damage:0.1,range:500,name:"Laser Charge",iv:0,textureID:-1,id:3,thick:25,// thickness
            make:{cost:{mg:2,no3:5,se:12},amount:3}
        }
    ]
}

async function resetConfig(){
    await localStorage.setItem('config', JSON.stringify(baseconfig))// make this more better
    updateInfo()
}

function getConfig(){
    if(!localStorage.getItem('config')){
        return baseconfig
    }
    if(localStorage.getItem('config') == 'undefined'){
        return baseconfig
    }
    return JSON.parse(localStorage.getItem('config'))
}

var config = getConfig()
 
function updateInfo(){
    config = getConfig()
    if(config.version != baseconfig.version){// todo make this not overwrite already stuff? idk
        resetConfig()
    }
    try{loadUserInfo()}catch(e){}
}

setInterval(updateInfo, 10000)
