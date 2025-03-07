// main menu before game start

function runMenu(){

    canvasClear()

    ctx.fillStyle = "#aaaaaa"

    // js css
    const mbw = Math.min(c.width/3, 200)// menu button width
    const mbh = Math.min(c.height/10, 50)// .. height
    const mbs = 10; // .. vertical spacing

    const bx = c.width/2 - mbw/2// button x
    const b1y = c.height/2-1.5*mbh-mbs// button 1 y
    const b2y = c.height/2 - mbh/2// etc
    const b3y = c.height/2 + mbh/2 + mbs

    ctx.fillRect(bx, b1y, mbw, mbh);
    ctx.fillRect(bx, b2y, mbw, mbh);
    ctx.fillRect(bx, b3y, mbw, mbh);

    ctx.font = (mbh-35) + "px " + "monospace"
    ctx.textAlign = "center"
    console.log(ctx.font)
    ctx.fillStyle = "#111111"
    const ts = mbh-20
    ctx.fillText("Play Singleplayer", (c.width/2), b1y+ts)
    ctx.fillText("Play Multiplayer", (c.width/2), b2y+ts)
    ctx.fillText("About", (c.width/2), b3y+ts)

}