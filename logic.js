let c = document.getElementById('c')
let x = c.getContext('2d')
let p ={
x: 600,
y: 480,
dir: 1,
hp: 100,
atk: 0,
atkCd: 0,
vx: 0
}
let mobs = []
let keys = {}
let spawnTimer = 0
let frame = 0
window.addEventListener('keydown', e =>{
keys[e.key.toLowerCase()] = true
if (e.key.toLowerCase() === 'j' && p.atkCd <= 0){
p.atk = 15
p.atkCd = 20
 }
})
window.addEventListener('keyup', e =>{
keys[e.key.toLowerCase()] = false
})

function spawnMob(){
let side = Math.random() > 0.5 ? 1 : -1
let sx = side === 1 ? 1250 : -50
mobs.push({
x: sx,
y: 480,
dir: side === 1 ? -1 : 1,
hp: 2,
speed: 1.5
 })
}

function update(){
if(keys['a'] || keys['arrowleft']){
p.x -= 5; p.dir = -1 }
if(keys['d'] || keys['arrowright']){
 p.x += 5; p.dir = 1 
}
if(p.x < 80)
p.x = 80
if(p.x > 1120)
p.x = 1120

if(p.atk > 0)
p.atk--
if(p.atkCd > 0)
p.atkCd--
spawnTimer--
if(spawnTimer <= 0){
spawnMob()
spawnTimer = 60
}

for(let i = mobs.length - 1; i >= 0; i--){
let m = mobs[i]
let dx = p.x - m.x
let dist = Math.abs(dx)
if(dist > 40){
m.x += m.dir * m.speed
}

if(p.atk > 0 && dist < 80){
m.hp--
if(m.hp <= 0)
mobs.splice(i, 1)
 }
}
frame++
}

function draw(){
x.fillStyle = '#04060a'
x.fillRect(0, 0, 1200, 600)
x.fillStyle = '#3b6b4b'
x.fillRect(p.x - 20, p.y - 40, 40, 40)
for(let m of mobs){
x.fillStyle = '#4b6b4b'
x.fillRect(m.x - 20, m.y - 40, 40, 40)
 }
}

function loop(){
update()
draw()
requestAnimationFrame(loop)
}
spawnTimer = 60
loop()
