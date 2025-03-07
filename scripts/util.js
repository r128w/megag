
function rand(seed) {
    // LCG using GCC's constants , thanks stackoverflow
    return Math.abs(((1103515245 * Math.abs(seed) + 12345) % 0x80000000)/(0x80000000-1))
}

function dist(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
}