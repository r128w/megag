// where the multiplayer magic happens

var sync = {
    mainID:"megagravity-test",
    self:{// stuff bout self
        index:0,
        peer:null,
        start:null
    },
    // other data, ie of player objects etc
    others:[],
    conns:[],
    timers:{
        update:null,
        recon:null,
        small:null
    }, // for resetting
    smallqueue:[],
    visqueue:[]
}

function resetConn(id){
    try{sync.conns[id].close()}catch(e){
        //console.log('did jack', e)/*do jack*/}
    }
    sync.others[id] = {
        obj:[]
    }
    sync.conns[id] = null// something something garbage collection
    // cant figureo ut how to make this reset/clear faster, but it does clear eventually
    // shouldnt hit the 500 limit on these objects
    // calling .close() and setting to null still wont delete them immediately though,
    // can pile up to 150 of these dead conn objects when playing w playerMax:10 reconninterval:1000 
    // issues shouldnt occur though, at normal values of around 10 and 10k
    sync.conns[id] = {open:false}
}

async function initSync(){

    sync.self.start = Date.now()// who has been here longest

    clearInterval(sync.timers.update)// sync.timer starts null, which is not a problem
    clearInterval(sync.timers.recon)
    clearInterval(sync.timers.small)

    console.log('start sync')
    for(var i = 0; i < config.playerMax; i++){
        resetConn(i)
    }
    findSpot()

    setTimeout(()=>{
        sync.timers.update = setInterval(sendUpdate, config.sync.updateInterval)
        sync.timers.recon = setInterval(establishConns, config.sync.reconnectInterval)
        sync.timers.small = setInterval(sendSmallUpdate, config.sync.smallInterval)
    }, 5000)// 5 seconds after finding spot, start attempting sends
    
    window.addEventListener('beforeunload', ()=>{
        sendUpdate(true)
        sync.self.peer.destroy()
        return null
    })
}

async function findSpot(){// recursion
    console.log("attempt take: "+sync.self.index)
    sync.self.peer = new Peer(sync.mainID + String(sync.self.index))

    sync.self.peer.on('error', (err)=>{
        if(err.type=='unavailable-id'){
            console.log("taken: " + sync.self.index)
            sync.self.index++
            if(sync.self.index>=config.playerMax){console.log('no connect: no open slot');return}
            findSpot()// do it again
        }else{
            if(err.type=='peer-unavailable'){/* cest la vie */}else{console.log(err)}
        }
    })

    sync.self.peer.on('open', (id)=>{
        console.log(id + " | " + sync.self.index + " | connected")
        p.id = sync.self.index
        establishConns()
    })

    sync.self.peer.on('disconnect', (id)=>{
        console.log('peer disconnected')
        initMenu()// take it back
    })

    sync.self.peer.on('connection', (conn)=>{
        let id = Number(conn.peer.replace(sync.mainID, ""))
        if(id > 0 && id < config.playerMax-1){
            sync.conns[id] = conn
            console.log('got connect: ' + id)
            chat.joined(id)
            sync.conns[id].on('close', ()=>{loseConn(id)})
            sync.conns[id].on('data', (stuff)=>{
                receiveData(stuff, id)
            })
            setTimeout(sendInitSync,1000,id)// another arbitrary delay to ensure the connection is fully established, no delay doesnt work
            
        }
    })
}

function sendInitSync(to){
    sync.conns[to].send({type:0,payload:{// send init update w/ planetlist
        start:sync.self.start,
        planets:planets
    }})
}

async function establishConns(){

    let msg = 'attempt connect: '

    for(var i = 0; i < config.playerMax; i ++){
        if(i == sync.self.index){continue}

        let a = i

        if(!sync.conns[i].open){
            try{
                resetConn(i)
                // console.log('closed', i)
            }catch(e){
                // do jack
                // console.log('did jack', e)
            }
            msg += i
            sync.conns[i] = sync.self.peer.connect(sync.mainID + String(i))
            sync.conns[i].on('open', ()=>{
                console.log('made connect: ' + a)
                chat.joined(a)
                sendInitSync(a)
            })
            sync.conns[i].on('close', ()=>{loseConn(a)})
            sync.conns[i].on('data', (stuff)=>{
                receiveData(stuff, a)
            })
            sync.conns[i].on('error', (e)=>{
                console.log('connect failed, ', e)
                resetConn(a)
            })
        }
    }

    console.log(msg)
}

function receiveData(stuff, a){
    // 0: init
    // 1: full pobject update
    // 2: small update (shooting, etc)
    // 3: planet update
    // 4: visual update


    switch(stuff.type){
        case 0:
            const overrides = (sync.self.start > stuff.payload.start)
            console.log("init data from " + a + " used? " + overrides, stuff)
            if(!overrides){break}
            planets = stuff.payload.planets
            break
        case 1:
            sync.others[a].obj = stuff.payload
            break
        case 2:
            // wip
            const timesince = Date.now() - stuff.ts
            for(var i = 0; i < stuff.payload.length; i ++){
                for(var ii = 0; ii < Math.min(30, timesince/16); ii ++){// push forward in physics up to 30 frames (0.5s), according to when it was sent
                    iterateThing(stuff.payload[i])
                }
                sync.others[a].obj.push(stuff.payload[i])
            }
            break
        case 3:
            planets[stuff.payload.id].resources = stuff.payload.value
            break
        case 4:
            for(var i = 0; i < stuff.payload.length; i ++){
                visuals.add(stuff.payload[i], a)
            }
            break
    }
}

function getConns(){
    var output = ""
    for(var i = 0; i < config.playerMax; i ++){
        if(i == sync.self.index){output+="S";continue}
        output+=(sync.conns[i].open ? "Y" : "N")
    }
    return output
}

async function sendUpdate(a=false){
    // sends update of pobjects to everyone else
    for(var i = 0; i < config.playerMax; i++){
        if(!sync.conns[i]){continue}
        if(!sync.conns[i].open){continue}
        // conn send type 0 = init
        // conn send tyep 1 = update
        
        let toSend = {type:1,payload:pobjects,ts:Date.now()}// timestamp/time sent
        if(a){toSend.payload=[]}// wipe update

        sync.conns[i].send(toSend)
    }
}

function initEmptySync(){
    for(var i = 0; i < config.playerMax; i++){
        resetConn(i)
    }
}

function sendSmallUpdate(){

    if(sync.smallqueue.length != 0){

        for(var i = 0; i < config.playerMax; i++){
            if(!sync.conns[i]){continue}
            if(!sync.conns[i].open){continue}
            
            let toSend = {type:2,payload:sync.smallqueue,ts:Date.now()}

            sync.conns[i].send(toSend)
        }
        
        sync.smallqueue = []// empty queue after sending
    }

    if(sync.visqueue.length != 0){

        for(var i = 0; i < config.playerMax; i++){
            if(!sync.conns[i]){continue}
            if(!sync.conns[i].open){continue}
            
            let toSend = {type:4,payload:sync.visqueue,ts:Date.now()}

            sync.conns[i].send(toSend)
        }
        
        sync.visqueue = []// empty queue after sending
    }
}

function smallUpdate(data, type=2){
    // sends small update (type 2+)
    // 2 - object
    // 3 - planet
    // 4 - visual

    switch(type){
        case 2:
            // add to objects queue
            sync.smallqueue.push(data)
            break
        case 3:
            for(var i = 0; i < config.playerMax; i++){
                if(!sync.conns[i]){continue}
                if(!sync.conns[i].open){continue}
                
                let toSend = {type:type,payload:data,ts:Date.now()}
        
                sync.conns[i].send(toSend)
            }
            break
        case 4:
            sync.visqueue.push(JSON.parse(JSON.stringify(data)))
            break
    }
    
    
}

function loseConn(id){
    sync.conns[id].close()// just in case
    // chat.left(id)
    console.log('lost connection: ' + id)
    resetConn(id)
}