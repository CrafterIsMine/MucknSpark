let ac = null
let mg = null
function boot(){
if(ac)
return
ac = new (window.AudioContext || window.webkitAudioContext)()
mg = ac.createGain()
mg.gain.value = 0.3
mg.connect(ac.destination)
}
function nb(){
let sz = ac.sampleRate * 0.5
let b = ac.createBuffer(1, sz, ac.sampleRate)
let d = b.getChannelData(0)
for(let i = 0; i < sz; i++){
d[i] = Math.random() * 2 - 1
}
return b
}
function sw(){
if(!ac)
return
let s = ac.createBufferSource()
s.buffer = nb()
let f = ac.createBiquadFilter()
f.type = 'bandpass'
f.frequency.value = 800
f.Q.value = 2
let g = ac.createGain()
g.gain.setValueAtTime(0.5, ac.currentTime)
g.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.2)
s.connect(f)
f.connect(g)
g.connect(mg)
s.start()
s.stop(ac.currentTime + 0.2)
}
function th(){
if(!ac)
return
let o = ac.createOscillator()
o.type = 'sine'
o.frequency.setValueAtTime(150, ac.currentTime)
o.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.3)
let g = ac.createGain()
g.gain.setValueAtTime(0.8, ac.currentTime)
g.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.3)
o.connect(g)
g.connect(mg)
o.start()
o.stop(ac.currentTime + 0.3)
}

function sh(){
if(!ac)
return
let o = ac.createOscillator()
o.type = 'sawtooth'
o.frequency.setValueAtTime(300, ac.currentTime)
o.frequency.linearRampToValueAtTime(100, ac.currentTime + 0.4)
let g = ac.createGain()
g.gain.setValueAtTime(0.3, ac.currentTime)
g.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.4)
o.connect(g)
g.connect(mg)
o.start()
o.stop(ac.currentTime + 0.4)
}
function wh(){
if(!ac)
return
let o = ac.createOscillator()
o.type = 'triangle'
o.frequency.value = 55
let g = ac.createGain()
g.gain.setValueAtTime(0, ac.currentTime)
g.gain.linearRampToValueAtTime(0.2, ac.currentTime + 0.5)
g.gain.linearRampToValueAtTime(0, ac.currentTime + 2)
o.connect(g)
g.connect(mg)
o.start()
o.stop(ac.currentTime + 2)
}
function dr(){
if(!ac)
return
let s = ac.createBufferSource()
s.buffer = nb()
let f = ac.createBiquadFilter()
f.type = 'lowpass'
f.frequency.value = 400
let g = ac.createGain()
g.gain.setValueAtTime(0.6, ac.currentTime)
g.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.8)
s.connect(f)
f.connect(g)
g.connect(mg)
s.start()
s.stop(ac.currentTime + 0.8)
}
document.addEventListener('keydown', boot, { once: true })
document.addEventListener('mousedown', boot, { once: true })