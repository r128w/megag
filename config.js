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
    sync:{
        updateInterval: 500,
        reconnectInterval: 10000
    },
    chatLength:128
}
