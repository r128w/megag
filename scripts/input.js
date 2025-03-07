
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
    tab:false,
    tabbed: false // ...
}
// console.log("ds")
window.addEventListener('DOMContentLoaded', ()=>{// who up nesting they listeners
    window.addEventListener('keydown', (e) => {
        switch(e.key){
            case "a":input.a=true;break
            case "d":input.d=true;break
            case "s":input.s=true;break
            case "w":input.w=true;break
            case "e":input.e=true;p.interact();break
            case " ":input.space=true;break
            case "Tab":input.tab=true;input.tabbed = !input.tabbed;e.preventDefault();break
            // default:console.log(e.key);break
        }
    })
    window.addEventListener('keyup', (e) => {
        switch(e.key){
            case "a":input.a=false;break
            case "d":input.d=false;break
            case "s":input.s=false;break
            case "w":input.w=false;break
            case "e":input.e=false;break
            case " ":input.space=false;break
            case "Tab":input.tab=false;e.preventDefault();break
        }
    })
})

c.addEventListener('mousemove', (e)=>{
    // console.log(event)
    input.mx = e.offsetX
    input.my = e.offsetY
})
c.addEventListener('mouseup', (e)=>{
    input.m = true;
    setTimeout(()=>{input.m=false}, 20)// JANK lmao
})
