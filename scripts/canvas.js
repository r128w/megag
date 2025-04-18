const c = document.getElementById('main-canvas');
const ctx = c.getContext('2d')

window.onresize = function(){
    c.width = c.clientWidth// clientwidth/height is that which is specified by the css on the canvas object
    c.height = c.clientHeight
    canvasClear()
}

var sprites = {}

function loadSprite(path, sublist){
    var item = new Image()
    item.src = './assets/'+path+'.png'
    if(sprites[sublist]){
        if(Array.isArray(sprites[sublist])){
            sprites[sublist].push(item)
        }else{
            sprites[sublist] = [sprites[sublist], item]
        }
    }else{
        sprites[sublist] = item
    }
}

function loadSprites(){
    loadSprite('player2', 'player')
    loadSprite('smoke', 'smoke')

    platformSprites = [
        'small', 'dock-main',// textureID 0-1
        'mg-empty','mg-full','no3-empty','no3-full','se-empty','se-full',// 2-7
        'turret-base'// 8
    ]
    for(var i = 0; i < platformSprites.length;i++){
        loadSprite('platforms/'+platformSprites[i], 'platforms')
    }

    loadSprite('barrels/barrel-main', 'barrels')// barrels textureid 0
    loadSprite('barrels/barrel-small', 'barrels')

    loadSprite('bullets/bul-main', 'bullets')// bullets textureid 0
    loadSprite('bullets/bomb', 'bullets')

    loadSprite('resources2', 'resources')// resources sprite
    loadSprite('bul-icons', 'bulicons')// for bullets, hotbar etc
}

var cam = {
    xo:0,
    yo:0,
    sx:1,
    sy:1
}


function canvasClear(){
    ctx.fillStyle="#000000"
    ctx.fillRect(-5000, -5000, 10000, 10000)
    
}

function renderFrame(){

    ctx.imageSmoothingEnabled=false

    ctx.textAlign = "center"
    ctx.font = 15 + "px " + "monospace";

    cam.xo=-p.x
    cam.yo=-p.y
    ctx.beginPath()

    ctx.setTransform(1, 0, 0, 1, c.width/2, c.height/2)

    canvasClear()

    //draw stars
    ctx.fillStyle="#dddddd"
    for(var i = p.x-700 - p.x%20; i < p.x+700; i += 20){
        for(var ii =(p.y - 500)-p.y%20; ii < p.y+500; ii+=20){
            if(rand(i + (ii*32435498374%13425))<0.02){
                drawRect(i,ii, 2, 2)
            }
        }
    }

    renderParticles()
    renderPlanets()
    renderPlatforms()
    renderBullets()
    chat.render()// i LOVE switching up my standards

    // console.log(cam.xo)

    for(var i = 0; i < config.playerMax; i++){// render players
        if(sync.conns[i].open){
            let op = sync.others[i].obj[0]// other player
            if(!op){continue}
            // console.log(sync.others[i].obj)
            drawSpriteRot(sprites.player, op.x, op.y, op.rot, op.r, true)
            if(op.hp != op.maxhp){
                drawBar(op.x, op.y+op.r+5, 50, op.hp/op.maxhp,"#666666",op.col)
            }
        }
    }
    drawSpriteRot(sprites.player, p.x, p.y, p.rot, p.r, true)
    

    renderUI()

    ctx.closePath()


}

function renderMinimap(){


    const minimapWidth = (input.tabbed ? Math.min(c.height - 40, c.width/2 - 120) : 250);

    ctx.save()

    ctx.beginPath()
    const xstart = 20 - c.width/2
    const ystart = 20 - c.height/2
    ctx.moveTo(xstart, ystart)
    ctx.lineTo(xstart + minimapWidth, ystart)
    ctx.lineTo(xstart + minimapWidth, ystart + minimapWidth)
    ctx.lineTo(xstart, ystart + minimapWidth)
    ctx.lineTo(xstart, ystart)
    ctx.closePath()
    
    ctx.clip()

    ctx.fillStyle="#333333"+(input.tabbed ? "66" : "aa")
    var closestPlanet = null
    var dist2p = 10000000
    for(var i = 0; i < planets.length; i ++){
        const d = dist(p.x, p.y, planets[i].x, planets[i].y)
        if(d<dist2p){closestPlanet=planets[i];dist2p=d}
    }
    const worldc = (!closestPlanet ? {x:p.x, y:p.y} : (dist2p < 5000 ? {// if there is no planet (null is truthy, and an object is falsy)
        x:(p.x+closestPlanet.x)/2,
        y:(p.y+closestPlanet.y)/2
    } : {x:p.x, y:p.y}));// world center of minimap

    const minimapScale = (config.minimap.hellaZoom ? 0.02 : 
    Math.min(0.3*minimapWidth/(dist2p+30*Math.sqrt(p.vx*p.vx+p.vy*p.vy)) * (input.tabbed ? 0.5 : 1), 0.3))

    ctx.fillRect(-c.width/2+20, -c.height/2+20, minimapWidth, minimapWidth)


    for(var i = 0; i < planets.length; i++){
        var drawX = xstart
        var drawY = ystart
        drawX += minimapWidth/2
        drawY += minimapWidth/2
        drawX += planets[i].x * minimapScale
        drawY += planets[i].y * minimapScale
        drawX -= worldc.x*minimapScale
        drawY -= worldc.y*minimapScale

        ui.drawCircle(drawX, drawY, planets[i].r * minimapScale, planets[i].col)

        if(config.minimap.drawPlanetInfluence){
            ui.drawCircle(drawX, drawY, planets[i].r * config.planetInfluenceFactor * minimapScale, planets[i].col+"11")
        }
        // ctx.beginPath()
        // ctx.moveTo(drawX + gravLimit*minimapScale, drawY)
        // ctx.lineTo(drawX, drawY + gravLimit*minimapScale)
        // ctx.lineTo(drawX - gravLimit*minimapScale, drawY)
        // ctx.lineTo(drawX, drawY - gravLimit*minimapScale)
        // ctx.fillStyle="#ffffff44"
        // ctx.fill()
        // ctx.closePath()

    }


    // orbital path
    const steps = config.minimap.pathPredictions
    const factor = config.minimap.pathPredictionResolution; // delta factor
    var cur = {x:p.x, y:p.y, vx:p.vx, vy:p.vy}
    // ctx.setTransform(minimapScale, 0, 0, minimapScale, -c.width/2 + 20 + (minimapWidth/2), -c.height/2 + 20 + (minimapWidth/2))
    ctx.setTransform(minimapScale, 0, 0, minimapScale, 20 + minimapWidth/2 - worldc.x*minimapScale, 20 + minimapWidth/2 - worldc.y*minimapScale)

    ctx.closePath()
    ctx.beginPath()
    ctx.strokeStyle='#aaaaaa'// prediction
    ctx.lineWidth=2/minimapScale
    ctx.moveTo(cur.x, cur.y)
    for(var i = 0; i < steps; i++){
        cur.x+=cur.vx * factor
        cur.y+=cur.vy * factor
        ctx.lineTo(cur.x, cur.y)
        var hit = false;
        for(var ii = 0; ii < planets.length; ii ++){

            const grav = getGravity(planets[ii].x, planets[ii].y, cur.x, cur.y, planets[ii].r*config.planetInfluenceFactor)

            cur.vx+= grav.x*planets[ii].mass*factor
            cur.vy+= grav.y*planets[ii].mass*factor

            if(grav.dist < planets[ii].r+16){hit=true;break}// landed
        }
        if(hit){break}
    }
    ctx.stroke()
    ctx.closePath()
    ctx.setTransform(1, 0, 0, 1, c.width/2, c.height/2)


    //platforms, physics objects
    for(var i = 0; i < pobjects.length; i++){
        if(pobjects[i].class=='Player'){continue}
        if(pobjects[i].class!='Platform'){continue}
        var drawX = xstart
        var drawY = ystart
        drawX += minimapWidth/2
        drawY += minimapWidth/2
        drawX += pobjects[i].x * minimapScale
        drawY += pobjects[i].y * minimapScale

        drawX -= worldc.x*minimapScale
        drawY -= worldc.y*minimapScale
        ui.drawCircle(drawX, drawY, Math.max(1.5, pobjects[i].r * minimapScale), pobjects[i].col)
    }


    // player
    var drawX = xstart
    var drawY = ystart
    drawX += minimapWidth/2
    drawY += minimapWidth/2
    drawX += p.x * minimapScale
    drawY += p.y * minimapScale

    drawX -= worldc.x*minimapScale
    drawY -= worldc.y*minimapScale

    const drawScale = Math.max(16*minimapScale, 3)

    ctx.beginPath()
    ctx.moveTo(drawX + Math.cos(p.rot)*drawScale*1.5, drawY + Math.sin(p.rot)*drawScale*1.5) // front point is a little extralarge

    ctx.lineTo(drawX + Math.cos(p.rot+2.356)*drawScale*1.414, drawY + Math.sin(p.rot+2.356)*drawScale*1.414)
    ctx.lineTo(drawX + Math.cos(p.rot+3.142)*drawScale*0.8, drawY + Math.sin(p.rot+3.142)*drawScale*0.8)
    ctx.lineTo(drawX + Math.cos(p.rot-2.356)*drawScale*1.414, drawY + Math.sin(p.rot-2.356)*drawScale*1.414)

    ctx.fillStyle=p.col
    ctx.fill()


    // rendering other players and their stuff
    for(var i = 0; i < config.playerMax; i ++){
        if(!sync.conns[i].open){continue}

        let op = sync.others[i].obj[0]

        //other platforms, physics objects
        for(var ii = 0; ii < sync.others[i].obj.length; ii++){
            let oo = sync.others[i].obj[ii]// other object
            if(oo.class=='Player'){continue}
            if(oo.class!='Platform'){continue}
            // console.log(oo.class)
            var drawX = xstart
            var drawY = ystart
            drawX += minimapWidth/2
            drawY += minimapWidth/2
            drawX += oo.x * minimapScale
            drawY += oo.y * minimapScale

            drawX -= worldc.x*minimapScale
            drawY -= worldc.y*minimapScale
            ui.drawCircle(drawX, drawY, Math.max(1.5, oo.r * minimapScale), oo.col)
        }

        if(!op){continue}

        // other player
        var drawX = xstart
        var drawY = ystart
        drawX += minimapWidth/2
        drawY += minimapWidth/2
        drawX += op.x * minimapScale
        drawY += op.y * minimapScale

        drawX -= worldc.x*minimapScale
        drawY -= worldc.y*minimapScale

        const drawScale = Math.max(16*minimapScale, 3)

        ctx.beginPath()
        ctx.moveTo(drawX + Math.cos(op.rot)*drawScale*1.5, drawY + Math.sin(op.rot)*drawScale*1.5) // front point is a little extralarge

        ctx.lineTo(drawX + Math.cos(op.rot+2.356)*drawScale*1.414, drawY + Math.sin(op.rot+2.356)*drawScale*1.414)
        ctx.lineTo(drawX + Math.cos(op.rot+3.142)*drawScale*0.8, drawY + Math.sin(op.rot+3.142)*drawScale*0.8)
        ctx.lineTo(drawX + Math.cos(op.rot-2.356)*drawScale*1.414, drawY + Math.sin(op.rot-2.356)*drawScale*1.414)

        ctx.fillStyle=op.col
        ctx.fill()
    }

    ctx.restore()
}

function renderUI(){

    // hp bar
    if(p.hp != p.maxhp){
        drawBar(p.x, p.y+p.r+5, 50, p.hp/p.maxhp,"#666666",p.col)
    }

    // boost bar
    if(p.boost.f < p.boost.max){
        drawBar(p.x, p.y+p.r+10, 30, p.boost.f/p.boost.max)
    }

    // planet overlay
    if(p.landed != null){
        const pl = p.landed
        const w = pl.r > 100 ? 150 : 100
        const h = pl.r > 100 ? 100 : 50
        const margin = pl.r > 100 ? 4 : 2
        const x = (pl.r < 150 ? pl.x : (2*p.x+pl.x)/3) - w/2
        const y = (pl.r < 150 ? pl.y : (2*p.y+pl.y)/3) - h/2
        ctx.font = (w/10) + "px monospace"
        drawRect(x, y, w, h, "#ffffff55")
        ctx.fillStyle="#000000"
        ctx.textAlign="left"
        ui.worldText(pl.name, x+margin, y+w/10+margin, w)
        ui.worldText("Magnesium: " + pl.resources.mg, x+margin, y+w/5+2*margin)
        ui.worldText("Nitrate: " + pl.resources.no3, x+margin, y+3*w/10+3*margin)
        ui.worldText("Selenium: " + pl.resources.se, x+margin, y+4*w/10+4*margin)
        ui.worldText("Hold E to mine", x+margin, y+5*w/10+5*margin)
    }

    if(!input.tabbed){
        // build menu, bottom left
        const margin = 10
        const w = Math.min(Math.max(c.width * 0.4, 250), 400) - margin*2
        const h = c.height/3 - 2*margin
        const x = -c.width/2
        const y = c.height/2 - h + margin
        ui.drawRect(x, y, w, h, "#00000066")
        ctx.fillStyle=p.col// could make this have contrast or smt idk
        ctx.font = "20px monospace"
        ctx.textAlign="left"
        ui.drawText(p.username, x, y + 24, p.col)
        ctx.drawImage(sprites.resources, x, y+24+margin/2)
       
        ui.drawText(`Magnesium: ${p.resources.mg}`, x + 27, y + 48, config.resources.colors.mg)
        ui.drawText(`Nitrate: ${p.resources.no3}`, x + 27, y + 72, config.resources.colors.no3)
        ui.drawText(`Selenium: ${p.resources.se}`, x + 27, y + 96, config.resources.colors.se)
        
    }

    for(var i = 0; i < pobjects.length; i ++){
        if(pobjects[i].class == 'Platform'){
            pobjects[i].renderUI()
        }
    }

    // ammo types 'hotbar' at bottom
    let a = 0
    for(var i = 0; i < p.stuff.ammo.length; i ++){
        if(p.stuff.ammo[i]){a++}}
        // console.log(a)

    const spacing = Math.max(50 - (a*5), 20)
    const bmargin = 70
    const scale = 3
    ctx.textAlign = 'center'
    ctx.font = '15px monospace'
    let b = 0
    for(var i = 0; i < p.stuff.ammo.length; i ++){
        if(p.stuff.ammo[i]){
            const x = ((scale*16)*a + spacing*(a-1))*-0.5 + b * (spacing + (scale*16))
            ctx.drawImage(
                sprites.bulicons,
                i*16,0,16,16,
                x,
                c.height/2 - bmargin,
                16*scale,16*scale
            )
            ui.drawText(
                config.bulstats[i].name,
                x + scale*16 / 2,
                c.height/2 - bmargin - 5,
                "#ffffff"
            )
            ui.drawText(
                p.stuff.ammo[i],
                x + scale*16 / 2,
                c.height/2 - bmargin + scale*16 + 10,
                "#ffffff"
            )
            b++ // peak mentioned
        }
    }


    renderMinimap()

}

// util drawing
function drawSpriteRot(sprite, x, y, rot, r=-1, smoothed=false){
    if(Math.abs(x)+Math.abs(y) > config.systemSize){// rotation render limit
        return// otherwise, floating point weirdness with the translate, rotate, untranslate, unrotate
    }
    ctx.imageSmoothingEnabled = smoothed // by default
    ctx.translate(x+cam.xo, y+cam.yo)
    ctx.rotate(rot)
    if(r<=0){
        ctx.drawImage(sprite, -sprite.width/2, -sprite.height/2, sprite.width, sprite.height)
    }else{
        ctx.drawImage(sprite, -r, -r, r*2, r*2)
    }
    ctx.rotate(-rot)
    ctx.translate(-x-cam.xo, -y-cam.yo)
    ctx.imageSmoothingEnabled = false
}
function drawSprite(sprite, x, y){ctx.drawImage(sprite, x + cam.xo, y + cam.yo)}
function drawRect(x, y, w, h, color="#ffffff"){ctx.fillStyle=color;ctx.fillRect(x + cam.xo, y + cam.yo, w, h)}
function drawCircle(x, y, r, color){
    ctx.closePath()
    ctx.beginPath()
    ctx.fillStyle=color
    ctx.ellipse(x + cam.xo, y + cam.yo, r, r, 0, 0, 6.29)
    ctx.fill()
}
function drawBar(x, y, w, p=1, col1="#666666", col2="#ffcc99"){
    const thick = (w < 50 ? 0.2 : 0.12)
    drawRect(x-w/2, y, w, w*thick, col1)
    const margin = 2
    drawRect(x-w/2+margin, y+margin, (w-margin*2)*Math.max(0,Math.min(p,1)), w*thick-margin*2, col2)
}

const ui = {
    drawRect:(x,y,w,h,col="#ffffff")=>{drawRect(x-cam.xo,y-cam.yo,w,h,col)},
    drawCircle:(x,y,r,col)=>{drawCircle(x-cam.xo,y-cam.yo,r,col)},
    worldText:(text, x, y, w=100000)=>{ctx.fillText(text, x+cam.xo, y+cam.yo, w)},
    drawText:(text, x, y, col="#000000")=>{ctx.fillStyle=col;ctx.fillText(text, x, y)}
}