// chat window management

var chat = {
    history:[],
    addMessage:function(msg, type=0){
        //type 0 - normal chat
        // 1 - system meessage (join/leave, etc)
        // 2 - error/problem message (not enough resources, etc)

        this.history.push({
            content:msg,
            type:type
        })
        if(this.history.length > config.chatLength){
            this.history.splice(0, config.chatLength-this.history.length)
        }
        // end of history array = most recent (queue)

    },
    render:function(){
        ctx.font = "16px monospace"
        if(this.history.length==0){return}
        const h = c.height*0.2
        const w = Math.min(350, c.width*0.4)

        ui.drawRect(c.width/2-w,-c.height/2,w,h,"#ffffff44")

        for(var i = 0;i<Math.min(this.history.length, 16);i++){
            const msg = this.history[this.history.length-i-1]
            ctx.textAlign='left'
            let col = "#000000"
            switch(msg.type){
                case 1: col = "#002200";break
                case 2: col = "#220000";break
            }
            ctx.fillStyle=col
            ctx.fillText(msg.content, c.width/2-w+2, -c.height/2+h-i*20-2)
        }
    },
    joined:function(id){
        chat.addMessage(`Connected with ID ${id}.`, 1)
    },
    left:function(id){
        chat.addMessage(`Disconnected with ID ${id}.`, 1)
    },
    problem:function(msg){// sends a message like 'not enough resources.'
        chat.addMessage(msg, 2)
    },
    system:function(msg){
        chat.addMessage(msg, 1)
    }
}
