// main menu before game start

var menu = {}

function runMenu(){
    let a = document.getElementById('userinfobox');a.style.left = `${(window.innerWidth-a.clientWidth)/2}px`
    // console.log(a.clientWidth)

    canvasClear()

    for(var i = 0; i < menu.ps.length;i++){
        const r = 153*(menu.ps[i].r / menu.maxr)
        const g = 238*(menu.ps[i].r / menu.maxr)
        const b = 170*(menu.ps[i].r / menu.maxr)
        drawCircle(menu.ps[i].x, menu.ps[i].y, menu.ps[i].r, `rgba(${r}, ${g}, ${b}, 255)`)

        const speed = 0.02

        menu.ps[i].x+=menu.vx*menu.ps[i].r*speed
        menu.ps[i].y+=menu.vy*menu.ps[i].r*speed

        if(menu.ps[i].x > c.width + menu.ps[i].r && menu.vx > 0){
            menu.ps[i].x -= Math.random()*200 + c.width + menu.ps[i].r*2
        }
        if(menu.ps[i].x < -menu.ps[i].r && menu.vx < 0){
            menu.ps[i].x += c.width + Math.random() * 200 + menu.ps[i].r*2
        }
        if(menu.ps[i].y > c.height + menu.ps[i].r && menu.vy > 0){
            menu.ps[i].y -= Math.random()*200 + c.height + menu.ps[i].r*2
        }
        if(menu.ps[i].y < -menu.ps[i].r && menu.vy < 0){
            menu.ps[i].y += c.height + Math.random() * 200 + menu.ps[i].r*2
        }

    }

    

    // js css
    const mbw = Math.min(c.width/3, 200)// menu button width
    const mbh = Math.min(c.height/10, 50)// .. height
    const mbs = 10; // .. vertical spacing

    const bx = c.width/2 - mbw/2// button x
    const b1y = c.height/2-1.5*mbh-mbs// button 1 y
    const b2y = c.height/2 - mbh/2// etc
    const b3y = c.height/2 + mbh/2 + mbs

    ctx.fillStyle = "#ffffff33"
    const margin = 20
    ctx.fillRect(bx-margin, b1y-margin, (mbw)+margin*2, (3*mbh+2*mbs)+margin*2)
    ctx.fillStyle = "#aaaaaa"

    ctx.fillRect(bx, b1y, mbw, mbh);
    ctx.fillRect(bx, b2y, mbw, mbh);
    ctx.fillRect(bx, b3y, mbw, mbh);

    ctx.textAlign = "center"

    ctx.fillStyle="#ffffff"
    ctx.font = (mbh+20) + "px " + "Trattatello";
    ctx.fillText("MegaGravity", (c.width/2), (b1y + mbh+20)/2)

    ctx.fillStyle = "#111111"
    ctx.font = (mbh-35) + "px " + "monospace"
    // console.log(ctx.font)
    const ts = mbh-20
    ctx.fillText("Play Multiplayer", (c.width/2), b1y+ts)
    ctx.fillText("Play Singleplayer", (c.width/2), b2y+ts)
    ctx.fillText("About", (c.width/2), b3y+ts)

    ctx.beginPath()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 5
    if(input.mx > bx && input.mx < bx + mbw){
        if(input.my > b1y && input.my < b1y + mbh){
            ctx.rect(bx, b1y, mbw, mbh)
            if(input.m){
                initGame(true)
            }
        }
        if(input.my > b2y && input.my < b2y + mbh){
            ctx.rect(bx, b2y, mbw, mbh)
            if(input.m){
                initGame(false)
            }
        }
        if(input.my > b3y && input.my < b3y + mbh){
            ctx.rect(bx, b3y, mbw, mbh)
            if(input.m){
                window.open("https://github.com/r128w/megag#readme", "_blank")
            }
        }
    }
    ctx.stroke()

}
function loadUserInfo(){
    let info = JSON.parse(localStorage.getItem('userinfo') || `{"name":"Anonymous","col":"#ffffff"}`)
    document.getElementById('usernamebox').innerText=info.name
    document.getElementById('usercolor').value=info.col
}
function updateUserInfo(){
    document.getElementById('userinfobox').className = 'hidden'
    localStorage.setItem('userinfo', `{"name":"${document.getElementById('usernamebox').innerText}","col":"${document.getElementById('usercolor').value}"}`)
}