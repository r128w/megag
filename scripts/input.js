
var input = {
    mx:-1,
    my:-1,
    m:false,
    a:false,
    d:false,
    s:false,
    w:false,
    e:false,
    space:false,
    shift:false,
    tab:false,
    tabbed: false // ...
}
// console.log("ds")
window.addEventListener('DOMContentLoaded', ()=>{// who up nesting they listeners
    window.addEventListener('keydown', (e) => {
        // console.log(e)
        let key=e.key.toLowerCase()

        switch(key){
            case "a":input.a=true;break
            case "d":input.d=true;break
            case "s":input.s=true;break
            case "w":input.w=true;break
            case "e":input.e=!p.interact();break// interact returns true if something happened (so e only counts as pressed if the init press didnt do anything)
            case " ":input.space=true;break
            case "shift":input.shift=true;break
            case "tab":input.tab=true;input.tabbed = !input.tabbed;e.preventDefault();break
            // default:console.log(e.key);break
        }
    })
    window.addEventListener('keyup', (e) => {

        let key=e.key.toLowerCase()

        switch(key){
            case "a":input.a=false;break
            case "d":input.d=false;break
            case "s":input.s=false;break
            case "w":input.w=false;break
            case "e":input.e=false;break
            case " ":input.space=false;break
            case "shift":input.shift=false;break
            case "tab":input.tab=false;e.preventDefault();break
        }
    })
})

c.addEventListener('mousemove', (e)=>{
    // console.log(event)
    input.mx = e.offsetX
    input.my = e.offsetY
    showCursor()
    clearTimeout(cursorTimer)
    cursorTimer = setTimeout(hideCursor, 2000)
})

var cursorTimer;
function hideCursor(){
    c.style.cursor="none"
}
function showCursor(cursor="auto"){
    c.style.cursor=cursor
}

c.addEventListener('mouseup', (e)=>{
    input.m = true;
    setTimeout(()=>{input.m=false}, 20)// JANK lmao
    showCursor()
    clearTimeout(cursorTimer)
    cursorTimer = setTimeout(hideCursor, 2000)
})