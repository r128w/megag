var config = {
    minimap:{
        drawPlanetInfluence: false,
        pathPredictions:100,
        pathPredictionResolution:10
    },
    resources:{
        mgMax:1,
        no3Max:0.8,
        seMax:0.5,
        genPeriod:2081// higher == less frequent, highly recommended to be prime or somewhat prime
    },
    bigG: 0.1,
    gravLimit: 5000,
    planetInfluenceFactor: 5,
    playerMax: 10,
    systemSize:30000,// how far out before things are deleted
    sync:{
        updateInterval: 500,
        reconnectInterval: 10000
    },
    chatLength:128,
    buildings:{
        names:["Base Platform", "Magnesium Mine", "Nitrate Farm", "Selenium Mine"],
        reqs:[{mg:10,no3:5}, {mg:40,no3:50}, {mg:50,no3:40}, {mg:100,no3:120}],
        buildtimes:[120, 480, 480, 960]
    }
}