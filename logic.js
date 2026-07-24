let c=document.getElementById('c')
let x=c.getContext('2d')

let p ={
x: 600,
y: 480,
dir: 1,
vx: 0
}
let keys = {}
window.addEventListener('keydown', e =>{
keys[e.key.toLowerCase()] = true
})

window.addEventListener('keyup', e =>{
keys[e.key.toLowerCase()] = false
})

function update(){
if(keys['a'] || keys['arrowleft']){
p.x -= 5
p.dir = -1
}
if(keys['d'] || keys['arrowright']){
p.x += 5
p.dir = 1
}

if(p.x < 80)
p.x = 80
if(p.x > 1120)
p.x = 1120
}

function draw(){
x.fillStyle = '#04060a'
x.fillRect(0, 0, 1200, 600)
x.fillStyle = '#3b6b4b'
x.fillRect(p.x - 20, p.y - 40, 40, 40)
}
function loop(){
update()
draw()
requestAnimationFrame(loop)
}
loop()