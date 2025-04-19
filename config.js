var config = {
    minimap:{
        drawPlanetInfluence: false,
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
        spacing:4500,
        minSpacing:1000,
        minPSize:200,
        maxPSize:600,
        initSpread:7000
    },
    gravLimit: 5000,
    planetInfluenceFactor: 5,
    playerMax: 10,
    systemSize:30000,// how far out before things are deleted
    sync:{
        updateInterval: 150, // might make this adjustable easily
        reconnectInterval: 10000
    },
    chatLength:128,
    buildings:{
        names:["Base Platform", "Magnesium Mine", "Nitrate Farm", "Selenium Mine", "Basic Turret", "Miniturret", "Ammo Factory"],
        reqs:[{mg:10,no3:5}, {mg:40,no3:50}, {mg:50,no3:40}, {mg:100,no3:120}, {mg:200,no3:150}, {mg:50,no3:25,se:75}, {mg:75,no3:10,se:25}],
        buildtimes:[120, 480, 480, 960, 480, 1080, 960],
        binds:['y', 'u', 'i', 'h', 'j', 'k'],// shared between all docks/menus
        previews:[-1, 2, 4, 6, 8, 0, 8],// preview sprites for build menu
        previewb:[-1, -1, -1, -1, 0, 1, -1]// preview barrels
    },
    bulstats:[
        {// base bullet
            firerate: 15, // actually a cooldown
            damage: 1,
            range: 400,
            iv: 8,
            name: "Bullet",
            textureID:0,
            make:{cost:null,amount:null}
        },
        {// minigun bullet
            firerate:3,damage:0.3,range:300,iv:8,spread:0.5,name:"Minigun",textureID:0,
            make:{cost:{mg:25,no3:30},amount:150}
        },
        {// bomb
            firerate:60,damage:10,range:300,iv:2,spread:1,name:"Bomb",textureID:1,
            make:{cost:{mg:10,no3:50},amount:5}
        }
    ]
}