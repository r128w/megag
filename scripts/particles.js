var particles = []


function addParticle(p){
    particles.push(p)
}

function iterateParticles(){
    for(var i = 0; i < particles.length;i++){
        particles[i].age++
        particles[i].x+=particles[i].vx
        particles[i].y+=particles[i].vy
        if(particles[i].age>40){particles.splice(i, 1)}
    }
}

function renderParticles(){
    for(var i = 0; i < particles.length;i++){
        drawSprite(sprites.smoke, particles[i].x, particles[i].y)
    }
}