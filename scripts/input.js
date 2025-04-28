
var input = {
    mx:-1,
    my:-1,
    a:false,
    d:false,
    s:false,
    w:false,
    e:false,
    _mc:false,
    space:false,
    shift:false,
    tab:false,
    num:null,// number keys
    tabbed: false, // ...
    _other: null,
    mousePos:()=>{// for use in game, with reference to ui/rendering which is relative to center of screen rather than corner
        return {
            x:input.mx - c.width/2,
            y:input.my - c.height/2
        }
    },
    mc:()=>{
        if(input._mc){input._mc = false;return true}
        return input._mc
    },
    other:()=>{
        if(input._other != null){
            temp = input._other
            input._other = null
            return temp
        }
        return input._other
    }
}
// console.log("ds")
window.addEventListener('DOMContentLoaded', ()=>{// who up nesting they listeners
    window.addEventListener('keydown', (e) => {
        
        let key=e.key.toLowerCase()

        switch(key){
            case "a":input.a=true;break
            case "d":input.d=true;break
            case "s":input.s=true;break
            case "w":input.w=true;break

            case "0":input.num=0;break
            case "1":input.num=1;break
            case "2":input.num=2;break
            case "3":input.num=3;break
            case "4":input.num=4;break
            case "5":input.num=5;break
            case "6":input.num=6;break
            case "7":input.num=7;break
            case "8":input.num=8;break
            case "9":input.num=9;break

            case "e":input.e=!p.interact();break// interact returns true if something happened (so e only counts as pressed if the init press didnt do anything)
            case " ":input.space=true;break
            case "shift":input.shift=true;break
            case "tab":input.tab=true;input.tabbed = !input.tabbed;e.preventDefault();break
            // default:console.log(e.key);break
            default: input._other = key;setTimeout(()=>{input._other=null},30);break
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

            case "0":input.num=null;break
            case "1":input.num=null;break
            case "2":input.num=null;break
            case "3":input.num=null;break
            case "4":input.num=null;break
            case "5":input.num=null;break
            case "6":input.num=null;break
            case "7":input.num=null;break
            case "8":input.num=null;break
            case "9":input.num=null;break
           
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
    input._mc = true;
    setTimeout(()=>{input._mc=false}, 30)// JANK lmao
    showCursor()
    clearTimeout(cursorTimer)
    cursorTimer = setTimeout(hideCursor, 2000)
})