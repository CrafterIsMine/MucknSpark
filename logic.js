let c = document.getElementById('c')
let x = c.getContext('2d')
let ov = document.getElementById('ov')
let st = document.getElementById('st')
let rs = document.getElementById('rs')
let hf = document.getElementById('h')
let wTxt = document.getElementById('w')
let pTxt = document.getElementById('p')
let fs = document.getElementById('fs')
let hsTxt = document.getElementById('hs')
let pImg = new Image()
pImg.src = 'p.png'
let mImg = new Image()
mImg.src = 'm.png'
let tImg = new Image()
tImg.src = 't.png'
let gameStarted = false
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
w: 170,
h: 100,
inv: 0
}
let mobs = []
let parts = []
let w = 1
let pts = 0
let hs = 0
let dead = false
let frame = 0
let keys = {}
let spawnTimer = 0
let waveDelay = 0
let mobsToSpawn = 0
let mobsSpawned = 0
let pLoaded = false
let mLoaded = false
let tLoaded = false
pImg.onload = () => { pLoaded = true }
mImg.onload = () => { mLoaded = true }
tImg.onload = () => { tLoaded = true }
pImg.onerror = () => { pLoaded = true }
mImg.onerror = () => { mLoaded = true }
tImg.onerror = () => { tLoaded = true }

window.addEventListener('keydown', e =>{
if(!gameStarted && !dead){
gameStarted = true
st.style.display = 'none'
boot()
}
keys[e.key.toLowerCase()] = true
if(dead) 
return
if(e.key.toLowerCase() === 'j' && p.atkCd <= 0){
p.atk = 18
p.atkCd = 22
sw()
}
if(e.key.toLowerCase() === 'k' && p.rollCd <= 0 && p.roll <= 0){
p.roll = 22
p.rollCd = 45
p.vx = p.dir * 14
p.inv = 22 
 }
})
window.addEventListener('keyup', e =>{
keys[e.key.toLowerCase()] = false
})

rs.addEventListener('click', ()=>{
reset()
})

function reset(){
p.x = 600
p.dir = 1
p.hp = 100
p.atk = 0
p.atkCd = 0
p.roll = 0
p.rollCd = 0
p.vx = 0
p.hit = 0
p.inv = 0
mobs = []
parts = []
w = 1
pts = 0
dead = false
frame = 0
spawnTimer = 0
waveDelay = 60
mobsToSpawn = 4
mobsSpawned = 0
ov.style.display = 'none'
st.style.display = 'flex'
gameStarted = false
updateUI()
}
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
w: 140,
h: 96,
type: Math.floor(Math.random() * 3)
})
mobsSpawned++
}

function update(){
if(dead)
return
frame++
if(!gameStarted)
return
if(waveDelay > 0){
waveDelay--
if(waveDelay === 30)
wh()
return
}

if(mobsSpawned < mobsToSpawn){
spawnTimer--
if(spawnTimer <= 0){
spawnMob()
spawnTimer = 60 + Math.random() * 50
 }
}
if(mobsSpawned >= mobsToSpawn && mobs.length === 0){
w++
mobsToSpawn = 4 + Math.floor(w * 1.5)
mobsSpawned = 0
waveDelay = 180
wh()
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
p.x -= 5
p.dir = -1
}
if(keys['d'] || keys['arrowright']){
p.x += 5
p.dir = 1
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
if(m.atkCd > 0)
m.atkCd--
let dx = p.x - m.x
let dist = Math.abs(dx)
if(dist > 40){
m.x += m.dir * m.speed
}
if(hitFrame){
let inFront = (p.dir === 1 && m.x > p.x - 20) || (p.dir === -1 && m.x < p.x + 20)
let distToSlash = Math.abs(m.x - hitX)
if(inFront && distToSlash < hitRange && Math.abs(m.y - p.y) < 60){
m.hp--
m.hit = 12
m.vx = p.dir * 8
th()
for(let k=0; k<10; k++){
parts.push({
x: m.x + (Math.random()-0.5)*20,
y: m.y - 40 + (Math.random()-0.5)*20,
vx: (Math.random()-0.5)*8,
vy: -Math.random()*6,
life: 35,
col: '#aa3b3b',
size: 3 + Math.random() * 2
 })
}
if(m.hp <= 0){
mobs.splice(i, 1)
pts += 10 * w
sh()
dr()
for(let k=0; k<20; k++){
parts.push({
x: m.x + (Math.random()-0.5)*30,
y: m.y - 40 + (Math.random()-0.5)*30,
vx: (Math.random()-0.5)*10,
vy: -Math.random()*8,
life: 50,
col: m.type === 0 ? '#4a2b2b' : m.type === 1 ? '#6a4b2b' : '#3b2b5a',
size: 4 + Math.random() * 3
 })
}
continue
}
 }
}
if(dist < 45 && m.atkCd <= 0 && p.roll <= 0 && p.inv <= 0){
let dmg = 12 + Math.floor(w * 1.2)
p.hp -= dmg
p.hit = 25
m.atkCd = 80
th()
for(let k=0; k<8; k++){
parts.push({
x: p.x + (Math.random()-0.5)*20,
y: p.y - 40 + (Math.random()-0.5)*20,
vx: (Math.random()-0.5)*6,
vy: -Math.random()*5,
life: 25,
col: '#ff5b5b',
size: 4
 })
}
if(p.hp <= 0){
p.hp = 0
dead = true
ov.style.display = 'flex'
fs.innerText = pts
if(pts > hs){
hs = pts
hsTxt.innerText = hs
}
dr()
 }
}
m.x += m.vx
m.vx *= 0.85
if(m.x < -150 || m.x > 1350){
mobs.splice(i, 1)
 }
}

for(let i = parts.length - 1; i >= 0; i--){
let pt = parts[i]
pt.x += pt.vx
pt.y += pt.vy
pt.vy += 0.4
pt.life--
if(pt.life <= 0)
parts.splice(i, 1)
}
updateUI()
}

function updateUI(){
let pct = Math.max(0, p.hp / p.maxHp)
hf.style.transform = 'scaleX(' + pct + ')'
wTxt.innerText = 'wave ' + w
pTxt.innerText = pts
}
function loop(){
update()
draw()
requestAnimationFrame(loop)
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
x.lineTo(i, 240 + Math.sin(i*0.008 + frame*0.002)*20)
}
x.lineTo(1200, 600)
x.lineTo(0, 600)
x.fill()
x.fillStyle = '#0c1218'
x.beginPath()
x.moveTo(0, 320)
for(let i=0; i<=1200; i+=120){
x.lineTo(i, 290 + Math.cos(i*0.012)*15)
}
x.lineTo(1200, 600)
x.lineTo(0, 600)
x.fill()

if(tLoaded && tImg.complete && tImg.naturalWidth !== 0){
let tw = tImg.naturalWidth
let th = tImg.naturalHeight
for(let ty = 450; ty < 600; ty += th){
for(let tx = 0; tx < 1200; tx += tw){
x.drawImage(tImg, tx, ty, tw, th)
 }
   }
}
else{
x.fillStyle = '#1a1515'
x.fillRect(0, 450, 1200, 150)
}
x.fillStyle = 'rgba(100, 120, 140, 0.03)'
for(let i=0; i<5; i++){
let fx = (frame * 0.5 + i * 300) % 1400 - 100
x.beginPath()
x.ellipse(fx, 350, 200, 40, 0, 0, Math.PI*2)
x.fill()
}

for(let pt of parts){
x.fillStyle = pt.col
x.globalAlpha = pt.life / 50
x.fillRect(pt.x, pt.y, pt.size, pt.size)
}
x.globalAlpha = 1

for(let m of mobs){
x.fillStyle = 'rgba(0,0,0,0.4)'
x.beginPath()
x.ellipse(m.x, m.y, 32, 10, 0, 0, Math.PI*2)
x.fill()
if(m.hit > 0 && frame % 4 < 2){
x.globalAlpha = 0.6
}
x.save()
x.translate(m.x, m.y)
if(m.dir === 1){
x.scale(-1, 1)
}
if(mLoaded && mImg.complete && mImg.naturalWidth !== 0){
x.drawImage(mImg, -m.w / 2, -m.h, m.w, m.h)
}
else{
let col = m.type === 0 ? '#4b6b4b' : m.type === 1 ? '#6b5b3b' : '#5b4b6b'
x.fillStyle = col
x.fillRect(-35, -80, 70, 80)
}
x.restore()
x.globalAlpha = 1
if(m.hp < m.maxHp){
x.fillStyle = '#1a0505'
x.fillRect(m.x - 30, m.y - 95, 60, 5)
x.fillStyle = '#aa2b2b'
x.fillRect(m.x - 30, m.y - 95, 60 * (m.hp / m.maxHp), 5)
 }
}
if(p.hit > 0 && frame % 4 < 2){
x.globalAlpha = 0.6
}
if(p.roll > 0){
x.globalAlpha = 0.7
}
if(p.inv > 0 && frame % 3 < 2){
x.globalAlpha = 0.8
}
x.fillStyle = 'rgba(0,0,0,0.5)'
x.beginPath()
x.ellipse(p.x, p.y, 40, 12, 0, 0, Math.PI*2)
x.fill()
x.save()
x.translate(p.x, p.y)
if(p.dir === 1){
x.scale(-1, 1)
}
if(pLoaded && pImg.complete && pImg.naturalWidth !== 0){
x.drawImage(pImg, -p.w / 2, -p.h, p.w, p.h)
}
else{
x.fillStyle = '#3b6b4b'
x.fillRect(-40, -80, 80, 80)
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
x.strokeStyle = 'rgba(255,255,255,0.5)'
x.lineWidth = 10
x.stroke()
}
x.globalAlpha = 1
if(waveDelay > 0 && waveDelay < 150 && waveDelay % 20 < 10){
x.fillStyle = '#8a9bab'
x.font = 'bold 36px Courier New'
x.textAlign = 'center'
x.fillText('wave ' + w, 600, 300)
 }
}
reset()
loop()
