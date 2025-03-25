
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

// for(var i = 0; i < 1000; i++){
//     console.log(nameGen())
// }