let c = document.getElementById('c')
let x = c.getContext('2d')
let hf = document.getElementById('h')
let wTxt = document.getElementById('w')
let pTxt = document.getElementById('p')

let p ={
x: 600,
y: 480,
dir: 1,
hp: 100,
maxHp: 100,
atk: 0,
atkCd: 0,
roll: 0,
rollCd: 0,
vx: 0,
hit: 0,
w: 120,
h: 96,
inv: 0
}
let mobs = []
let parts = []
let w = 1
let pts = 0
let keys = {}
let spawnTimer = 0
let waveDelay = 0
let mobsToSpawn = 0
let mobsSpawned = 0
let frame = 0
let pImg = new Image()
pImg.src = 'p.png'
let mImg = new Image()
mImg.src = 'm.png'
let tImg = new Image()
tImg.src = 't.png'
let pLoaded = false
let mLoaded = false
let tLoaded = false
pImg.onload = () => { pLoaded = true }
mImg.onload = () => { mLoaded = true }
tImg.onload = () => { tLoaded = true }
window.addEventListener('keydown', e=>{
keys[e.key.toLowerCase()] = true
if(e.key.toLowerCase() === 'j' && p.atkCd <= 0){
p.atk = 18
p.atkCd = 22
}
if(e.key.toLowerCase() === 'k' && p.rollCd <= 0 && p.roll <= 0){
p.roll = 22
p.rollCd = 45
p.vx = p.dir * 14
p.inv = 22
 }
})
window.addEventListener('keyup', e=>{
keys[e.key.toLowerCase()] = false
})

function spawnMob(){
let side = Math.random() > 0.5 ? 1 : -1
let sx = side === 1 ? 1250 : -50
let speed = 1.2 + (w * 0.12) + (Math.random() * 0.4)
mobs.push({
x: sx,
y: 480,
dir: side === 1 ? -1 : 1,
hp: 2 + Math.floor(w / 2),
maxHp: 2 + Math.floor(w / 2),
atkCd: 0,
hit: 0,
vx: 0,
speed: speed,
w: 96,
h: 96,
type: Math.floor(Math.random() * 3)
})
mobsSpawned++
}

function update(){
if(waveDelay > 0){
waveDelay--
return
}
if(mobsSpawned < mobsToSpawn){
spawnTimer--
if(spawnTimer <= 0){
spawnMob()
spawnTimer = 60 + Math.random() * 50
 }
}
else if(mobs.length === 0){
w++
mobsToSpawn = 4 + Math.floor(w * 1.5)
mobsSpawned = 0
waveDelay = 180
}
if(p.roll > 0){
p.roll--
p.x += p.vx
p.vx *= 0.88
if(p.inv > 0)
p.inv--
}
else{
if(keys['a'] || keys['arrowleft']){
p.x -= 5; p.dir = -1
}
if(keys['d'] || keys['arrowright']){
p.x += 5; p.dir = 1 
 }
}
if(p.x < 80)
p.x = 80
if(p.x > 1120)
p.x = 1120

if(p.atk > 0)
p.atk--
if(p.atkCd > 0)
p.atkCd--
if(p.rollCd > 0)
p.rollCd--
if(p.hit > 0)
p.hit--
let hitFrame = p.atk === 15
let hitX = p.x + p.dir * 50
let hitRange = 80
for(let i = mobs.length - 1; i >= 0; i--){
let m = mobs[i]
if(m.hit > 0)
m.hit--
let dx = p.x - m.x
let dist = Math.abs(dx)

if(dist > 40)
m.x += m.dir * m.speed
if(hitFrame){
let inFront = (p.dir === 1 && m.x > p.x - 20) || (p.dir === -1 && m.x < p.x + 20)
let distToSlash = Math.abs(m.x - hitX)
if(inFront && distToSlash < hitRange){
m.hp--
m.hit = 12
m.vx = p.dir * 8
for(let k=0; k<10; k++){
parts.push({
x: m.x, y: m.y - 40,
vx: (Math.random()-0.5)*8,
vy: -Math.random()*6,
life: 35, col: '#aa3b3b', size: 3
 })
}
if(m.hp <= 0){
mobs.splice(i, 1)
pts += 10 * w
continue
}
 }
}

if(dist < 45 && p.roll <= 0 && p.inv <= 0){
p.hp -= 12 + Math.floor(w * 1.2)
p.inv = 25
}

m.x += m.vx
m.vx *= 0.85
}

for (let i = parts.length - 1; i >= 0; i--) {
let pt = parts[i]
pt.x += pt.vx
pt.y += pt.vy
pt.vy += 0.4
pt.life--
if(pt.life <= 0)
parts.splice(i, 1)
}
let pct = Math.max(0, p.hp / p.maxHp)
hf.style.transform = 'scaleX(' + pct + ')'
wTxt.innerText = 'wave ' + w
pTxt.innerText = pts
}

function draw(){
let bg = x.createLinearGradient(0, 0, 0, 600)
bg.addColorStop(0, '#04060a')
bg.addColorStop(0.6, '#0a0f14')
bg.addColorStop(1, '#141010')
x.fillStyle = bg
x.fillRect(0, 0, 1200, 600)
x.fillStyle = '#080c12'
x.beginPath()
x.moveTo(0, 280)
for(let i=0; i<=1200; i+=80){
x.lineTo(i, 240 + Math.sin(i*0.008)*20)
}
x.lineTo(1200, 600)
x.lineTo(0, 600)
x.fill()

if(tLoaded && tImg.complete){
let tw = tImg.naturalWidth
let th = tImg.naturalHeight
for(let ty = 450; ty < 600; ty += th){
for(let tx = 0; tx < 1200; tx += tw){
x.drawImage(tImg, tx, ty, tw, th)
 }
  }  
}
for(let pt of parts){
x.fillStyle = pt.col
x.globalAlpha = pt.life / 35
x.fillRect(pt.x, pt.y, pt.size, pt.size)
}
x.globalAlpha = 1

for(let m of mobs){
x.save()
x.translate(m.x, m.y)
if(m.dir === 1)
x.scale(-1, 1)
if(mLoaded && mImg.complete){
x.drawImage(mImg, -m.w / 2, -m.h, m.w, m.h)
 }
x.restore()
}
x.save()
x.translate(p.x, p.y)
if(p.dir === 1)
x.scale(-1, 1)
if(pLoaded && pImg.complete){
x.drawImage(pImg, -p.w / 2, -p.h, p.w, p.h)
}
x.restore()
if(p.atk > 0){
x.strokeStyle = '#e0e0e0'
x.lineWidth = 5
x.beginPath()
let arcX = p.x + p.dir * 50
let startA = p.dir === 1 ? -Math.PI * 0.6 : Math.PI * 0.4
let endA = p.dir === 1 ? Math.PI * 0.4 : Math.PI * 1.0
x.arc(arcX, p.y - 30, 65, startA, endA)
x.stroke()
 }
}
function loop(){
update()
draw()
requestAnimationFrame(loop)
}
mobsToSpawn = 4
loop()
