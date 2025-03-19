// where the multiplayer magic happens

var sync = {
    mainID:"megagravity-test",
    self:{// stuff bout self
        index:0,
        peer:null,
    },
    // other data, ie of player objects etc
    others:[],
    conns:[],
    timer:null // for resetting
}

function resetConn(id){
    sync.others[id] = {
        obj:[]
    }
    sync.conns[id] = {open:false}
}

async function initSync(){
    clearInterval(sync.timer)// sync.timer starts null, which is not a problem

    console.log('start sync')
    for(var i = 0; i < config.playerMax; i++){
        resetConn(i)
    }
    findSpot()

    setTimeout(()=>{
        sync.timer = setInterval(sendUpdate, config.updateInterval)
    }, 5000)// 5 seconds after finding spot, start attempting sends
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
        establishConns()
    })

    sync.self.peer.on('connection', (conn)=>{
        let id = Number(conn.peer.replace(sync.mainID, ""))
        if(id > 0 && id < config.playerMax-1){
            sync.conns[id] = conn
            console.log('got connect: ' + id)
            sync.conns[id].on('close', ()=>{console.log('lost connection: ' + id);resetConn(id)})
            sync.conns[id].on('data', (stuff)=>{
                receiveData(stuff, id)
            })
            setTimeout(()=>{sync.conns[id].send({type:0,payload:{// send init update w/ planetlist
                planets:planets
            }
            })},1000)// another arbitrary delay to ensure the connection is fully established, no delay doesnt work
            
        }
    })
}

async function establishConns(){
    for(var i = 0; i < config.playerMax; i ++){
        if(i == sync.self.index){continue}

        let a = i

        if(!sync.conns[i].open){
            console.log('attempt connect: ' + i)
            sync.conns[i] = sync.self.peer.connect(sync.mainID + String(i))
            sync.conns[i].on('open', ()=>{console.log('made connect: ' + a)})
            sync.conns[i].on('close', ()=>{console.log('lost connection: ' + a)})
            sync.conns[i].on('data', (stuff)=>{
                receiveData(stuff, a)
            })
        }
    }
}

function receiveData(stuff, a){
    // console.log('data: ' + a)
    // console.log(stuff)
    if(stuff.type==0){
        console.log("init data: " + a)
        console.log(stuff)
        planets = stuff.payload.planets
    }
    if(stuff.type==1){
        sync.others[a].obj = stuff.payload
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

async function sendUpdate(){
    // sends update of pobjects to everyone else
    for(var i = 0; i < config.playerMax; i++){
        if(!sync.conns[i]){continue}
        if(!sync.conns[i].open){continue}
        // conn send type 0 = init
        // conn send tyep 1 = update
        sync.conns[i].send({type:1,payload:pobjects})// simple for now
    }
}

function initEmptySync(){
    for(var i = 0; i < config.playerMax; i++){
        resetConn(i)
    }
}