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
        'turret-base', 'dock-ammo', 'dock-turret', 'dock-defense',// 8-11
        'shield-small', 'shield-medium', 'shield-big' // 12-14
    ]

    for(var i = 0; i < platformSprites.length;i++){
        loadSprite('platforms/'+platformSprites[i], 'platforms')
    }

    loadSprite('barrels/barrel-main', 'barrels')// barrels textureid 0
    loadSprite('barrels/barrel-small', 'barrels')

    loadSprite('bullets/bul-main', 'bullets')// bullets textureid 0
    loadSprite('bullets/bomb', 'bullets')

    loadSprite('ui/resources2', 'ui')
    loadSprite('ui/bul-icons', 'ui')
    loadSprite('ui/player-icon', 'ui')
    loadSprite('ui/pointer', 'ui')
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

    renderPlatforms()
    renderBullets()

    renderVisuals()

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
    

    renderFields()

    renderPlanets()

    renderUI()

    ctx.closePath()


}

function renderMinimap(){


    const minimapWidth = (input.tabbed ? Math.min(c.height - 80, c.width/2 - 150) : 250);

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

        const planetInfluenceTransparency = (config.minimap.drawPlanetInfluence == true ? 8 : config.minimap.drawPlanetInfluence)
        let string = (planetInfluenceTransparency || 0).toString(16)
        if(string.length == 1){string = "0"+string}

        ui.drawCircle(drawX, drawY, planets[i].r * config.planetInfluenceFactor * minimapScale, planets[i].col+string)
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


    //platforms, no fields or non-platform objects
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
    

    if(!input.tabbed){// normal ui
        

        if(p.landed != null){
            // planet overlay
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

        for(var i = 0; i < pobjects.length; i ++){// platform uis (bars, build menus, etc)
            if(pobjects[i].class == 'Platform'){
                pobjects[i].renderUI()
            }
        }

        // resource/player menu, bottom left
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
        ctx.drawImage(sprites.ui[0], x, y+24+margin/2)
       
        ui.drawText(`Magnesium: ${p.resources.mg}`, x + 27, y + 48, config.resources.colors.mg)
        ui.drawText(`Nitrate: ${p.resources.no3}`, x + 27, y + 72, config.resources.colors.no3)
        ui.drawText(`Selenium: ${p.resources.se}`, x + 27, y + 96, config.resources.colors.se)

        chat.render()

        // ammo types 'hotbar' at bottom
        let a = 0
        for(var i = 0; i < p.stuff.ammo.length; i ++){
            if(p.stuff.ammo[i] || i == 0){a++}}

        if(!(p.shoot.id == 0 && a == 1)){
            const spacing = Math.max(50 - (a*5), 20)
            const bmargin = 70
            const scale = 3
            ctx.textAlign = 'center'
            ctx.font = '15px monospace'
            let b = 0
            for(var i = 0; i < p.stuff.ammo.length; i ++){
                if(p.stuff.ammo[i] > 0 || i == 0){

                    const x = ((scale*16)*a + spacing*(a-1))*-0.5 + b * (spacing + (scale*16))
                    
                    if(p.shoot.id == i){// highlight if selected
                        const extra = 15// margin
                        ui.drawRect(x - extra, c.height/2 - bmargin - extra, 16*scale + 2*extra, 16*scale + 2*extra, "#ffffff55")
                    }

                    ctx.drawImage(
                        sprites.ui[1],
                        i*16,0,16,16,
                        x,
                        c.height/2 - bmargin,
                        16*scale,16*scale
                    )
                    ui.drawText(
                        config.bulstats[i].name,
                        x + scale*16 / 2,
                        c.height/2 - bmargin,
                        "#ffffff"
                    )
                    ui.drawText(
                        i == 0 ? "Inf" : p.stuff.ammo[i],
                        x + scale*16 / 2,
                        c.height/2 - bmargin + scale*16 + 10,
                        "#ffffff"
                    )
                    ui.drawText(b+1, x+scale*16 + 8, c.height/2-bmargin + scale*16 + 10, "#ffffffaa")
                    b++ // peak mentioned
                }
            }
        }
        
    }else{// navigation mode

        // player velocity, etc menu
        ctx.textAlign = "center"
        ctx.font = "8px monospace"
        const x = -90
        const y = c.height/2 - 200
        const w = 180
        const h = 180
        ui.drawRect(x,y,w,h,"#33333366")

        // ctx.drawImage(sprites.ui[2], x + w/2 - 25, y + 65, 50, 50) // playericon sprite
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.moveTo(x + w/2, y + 65)
        ctx.lineTo(x + w/2 - 25, y + 115)
        ctx.lineTo(x + w/2 + 25, y + 115)
        ctx.fill()

        let b = {d:1e10,id:0,x:10,y:0} // closest planet arrow
        for(var i = 0; i < planets.length; i ++){
            let dx = p.x - planets[i].x
            let dy = p.y - planets[i].y
            let d = dx*dx+dy*dy
            if(d < b.d){b = {d:d,id:i,x:dx,y:dy}}
        }

        let angle = Math.atan2(b.y, b.x) - p.rot + 1.57
        ui.drawCircle(x+w/2 + 50*Math.cos(angle), y + 90 + 50*Math.sin(angle), 9, planets[b.id].col)
        ui.drawText("p", x + w/2 + 50*Math.cos(angle), y + 92 + 50*Math.sin(angle), "#000000")

        let sb = {d:1e10,id:0,x:10,y:0} // second closest planet arrow
        for(var i = 0; i < planets.length; i ++){
            if(i == b.id){continue}
            let dx = p.x - planets[i].x
            let dy = p.y - planets[i].y
            let d = dx*dx+dy*dy
            if(d < sb.d){sb = {d:d,id:i,x:dx,y:dy}}
        }
        angle = Math.atan2(sb.y, sb.x) - p.rot + 1.57
        ui.drawCircle(x+w/2 + 50*Math.cos(angle), y + 90 + 50*Math.sin(angle), 7, planets[sb.id].col)
        ui.drawText("p", x + w/2 + 50*Math.cos(angle), y + 92 + 50*Math.sin(angle), "#000000")

        if(Math.abs(p.vx) + Math.abs(p.vy) > 1){
            const angle = Math.atan2(p.vy, p.vx) - p.rot - 1.57
            // ui.drawSpriteRot(sprites.ui[3], x + w/2, y + w/2, 
            //     angle, 60)
            ui.drawCircle(x+w/2 + 50*Math.cos(angle), y + 90 + 50*Math.sin(angle), 7, "#ffee66")
            ui.drawText("v", x + w/2 + 50*Math.cos(angle), y + 92 + 50*Math.sin(angle), "#000000")
        }

        if(Math.abs(p.vr) > 0.005){
            const bw = 50*Math.atan(10 * p.vr)
            const bx = x + w/2 + (p.vr > 0 ? 8: -8)
            ui.drawRect(bx, y + 15, bw, 10, "#ffffff")
            ui.drawText("vr", bx + bw/2, y + 12, "#ffffff")
        }

        renderMinimap()


        const margn = 10
        ui.drawRect(-c.width/2 + margn*3, c.height/2 - margn - 40, 200, 40,"#33333366")
        ctx.font = "12px monospace"
        ui.drawText("Inertial Dampening", -c.width/2 + margn*3 + 100, c.height/2 - margn - 26, "#ffffff")
        ui.drawRect(-c.width/2 + margn*3 + 10, c.height/2 - margn - 40 + 24, 180, 8,"#aaaaaa66")

        ui.drawRect(-c.width/2 + margn*3 + 10, c.height/2 - margn - 40 + 22, p.inertial * 180, 12,"#dddddd")

        const mp = input.mousePos()
        if(mp.x > -c.width/2 + margn*3 && mp.x < -c.width/2 + margn*3 + 200){
            if(mp.y > c.height/2 - margn - 40 && mp.y < c.height/2 - margn - 40 + 40){
                ui.drawRect(mp.x, mp.y-100, 200, 100,"#33333366")
                ctx.font = "12px monospace"
                ui.drawText("Inertial Dampening", mp.x + 100, mp.y - 85, "#ffffff")
                ui.drawText("Divert power from boost", mp.x + 100, mp.y - 70, "#aaaaaa")
                ui.drawText("to control the ship's", mp.x + 100, mp.y - 55, "#aaaaaa")
                ui.drawText("rotation to ease", mp.x + 100, mp.y - 40, "#aaaaaa")
                ui.drawText("rotational control, but", mp.x + 100, mp.y - 25, "#aaaaaa")
                ui.drawText("slow boost regen and max.", mp.x + 100, mp.y - 10, "#aaaaaa")

                if(input.md){
                    let newValue = Math.max(0, Math.min(1, (mp.x - (-c.width/2 + margn*3 + 10)) / 180))
                    localStorage.setItem('inertial', newValue)
                    p.inertial = newValue
                    console.log(newValue)
                }
            }
        }
        

    }



}

// util drawing
function drawSpriteRot(sprite, x, y, rot, r=-1, smoothed=false){
    if(!sprite){return}
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
    drawText:(text, x, y, col="#000000")=>{ctx.fillStyle=col;ctx.fillText(text, x, y)},
    drawSpriteRot:(sprite, x, y, rot, r, smoothed = false)=>{drawSpriteRot(sprite, x - cam.xo, y - cam.yo, rot, r, smoothed)}
}