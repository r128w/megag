
function rand(seed) {
    // LCG using GCC's constants , thanks stackoverflow
    return Math.abs(((1103515245 * Math.abs(seed) + 12345) % 0x80000000)/(0x80000000-1))
}

function dist(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
}

function nameGen(){
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const vowels = 'aeiouy'
    const consonants = 'bcdfghjklmnpqrstvwxz'
    let length = Math.max(Math.random()*6, Math.random()*7) + 1
    var output = String(chooseRandom(alphabet)).toUpperCase()
    for(var i = 0; i < length-1; i ++){
        output+=chooseRandom(i % 2 == 0 ? vowels : consonants)
    }

    return output
}

function chooseRandom(arr){
    return arr[Math.floor(Math.random()*arr.length)]
}

const color = {
    colGen:function (){
        // generates a nice, pastel-ish desaturated color
        var r = Math.random()*100 + 150
        var g = Math.random()*100 + 150
        var b = Math.random()*100 + 150
    
        var avg = (r+g+b)/3
        const f = -0.3// contrast
        r+=(r-avg)*f// move each away/towards from the average
        g+=(g-avg)*f
        b+=(b-avg)*f
    
        return this.rgbToHex(r,g,b);
    },
    rgbToHex:function (r, g, b){// she overflow on my stack (verbatim)
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    },
    hexToRgb:function(hex){// also verbatim
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    },
    interpolate(hex1, hex2, amt){// this one is not externally made
        const a = this.hexToRgb(hex1)
        const b = this.hexToRgb(hex2)
        const ant = 1-amt
        return this.rgbToHex(
            a.r*ant+b.r*amt,
            a.g*ant+b.g*amt,
            a.b*ant+b.b*amt
        )
    },
    warm:function(){
        // generates red-yellow color
        const g = Math.random()*255
        const b = Math.random()*100
        return this.rgbToHex(255, g, b)
    }
    
}