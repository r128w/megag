// chat window management

var chat = {
    history:[],
    addMessage:function(msg, type=0){
        //type 0 - normal chat
        // 1 - system meessage (join/leave, etc)

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
        if(this.history.length==0){return}
        const h = c.height*0.2
        const w = Math.min(350, c.width*0.4)

        ui.drawRect(c.width/2-w,-c.height/2,w,h,"#ffffff44")

        for(var i = 0;i<Math.min(this.history.length, 16);i++){
            const msg = this.history[this.history.length-i-1]
            ctx.textAlign='left'
            ctx.fillStyle=(msg.type == 0 ? "#000000" : "#002200")
            ctx.fillText(msg.content, c.width/2-w+2, -c.height/2+h-i*20-2)
        }
    },
    joined:function(username, id){
        chat.addMessage(`${username} (${id}) joined the game.`, 1)
    },
    left:function(username, id){
        chat.addMessage(`${username} (${id}) left the game.`, 1)
    }
}