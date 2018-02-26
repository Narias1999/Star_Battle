const audioExplosion = document.getElementById('soundExplosion')
audioExplosion.volume = .4
const audioFuel = document.getElementById('soundFuel')
const audioPausa = document.getElementById('soundPausa')
const audioShoot = document.getElementById('soundShoot')
let audios = true
let points = 0
let minutes = 0
let seconds = 0
let fuel = 15
let isStarted = false
const secondsEl = document.getElementById('seconds')
const minutesEl = document.getElementById('minutes')
const fuelEl = document.getElementById('fuel')
const pointsEl = document.getElementById('points')
let spaceship
let enemys = []
let ships = []
let enemyCounter = 0
let flag = false
let appearShips = true
secondsEl.innerHTML = '00'
minutesEl.innerHTML = '00'
pointsEl.innerHTML = points
fuelEl.style.width = fuel*2 + 'px'
let enemyCoords, bulletCoords, cronometer, fuelCounter, loseInterval, explosionPos
let maxTime = 9000
const parallax = document.querySelector('.parallax')
const calcWidth = () => window.innerWidth - 6
const calcHeight = () => window.innerHeight - 6
const random = (max, min)=> Math.floor(Math.random() * (max - min +1)) + min
const calcTop = height => random(calcHeight() - height/2, height/2*-1)
const deleteElement = (e) => e.parentElement.removeChild(e)
const calcCoords = (el) => {
    return {
        p1: {x: el.offsetLeft, y: el.offsetTop},
        p2: {x: el.offsetLeft + el.width, y: el.offsetTop},
        p3: {x: el.offsetLeft, y: el.offsetTop + el.height},
        p4: {x: el.offsetLeft + el.width, y: el.offsetTop + el.height}
    }
}
const isPointEnter = (p, parent) => (p.x > parent.p1.x && p.x < parent.p2.x) && (p.y > parent.p1.y && p.y < parent.p3.y)
const isElementCollided = (s, p) => isPointEnter(s.p1, p) || isPointEnter(s.p2, p) || isPointEnter(s.p3, p) ||isPointEnter(s.p4, p)
let loseCounter = 0
function lose () {
    spaceship.ship.style.opacity = 0
    explosionPos = calcCoords(spaceship.ship).p1
    explosionPos.x +=20
    explosionPos.y +=20
    document.removeEventListener('keydown', shoot)
    clearInterval(cronometer)
    clearInterval(fuelCounter)
    appearShips = false
    loseInterval = setInterval(()=> {
        loseCounter++
        if(loseCounter < 10) {
            explosion(explosionPos)
            if (random(1,0)) explosionPos.x += random(10, 30)
            else explosionPos.x -= random(10, 30)
            if (random(1,0)) explosionPos.y += random(10, 30)
            else explosionPos.y -= random(10, 30)
        } else gameOver()
    }, 400)
    for (ship of ships) {
        if (!ship.type) ship.stopShoot()
    }
}
function modal(action) {
    const time = 1
    const modal = document.querySelector('.instructions')
    const wrap = document.querySelector('.modal-wrap')
    if (action == 'show') {
        modal.style.display = 'block'
        wrap.style.display = 'block'
        modal.style.animation = `showModal ${time}s ease`
        wrap.style.animation = `showWrap ${time}s ease`
    } else {
        modal.style.animation = `unshowModal ${time}s ease`
        wrap.style.animation = `unshowWrap ${time}s ease`
        setTimeout(()=> {
            modal.style.display = 'none'
            wrap.style.display = 'none'
        }, time*1000-1)
    }
}
function gameOver() {
    const elemento = document.querySelector('.game-over')
    parallax.style.cursor = 'default'
    clearInterval(loseInterval)
    elemento.style.height = '100%'
    elemento.style.transform = 'scale(1)'
}
function interval () {
        if(maxTime >= 1800) maxTime -= 90
        const time = random(1000, maxTime)
        setTimeout(() => {
            if (appearShips) {
                const shipPos = random(0, window.screen.width-90)
                new enemySpaceShip(shipPos)
                interval()
            }
        }, time)
    
}
function interval2 () {
        const time = random(8000, 10000)
        setTimeout(() => {
            if (appearShips) {
                const shipPos = random(0, window.screen.width-90)
                new friendSpaceship(shipPos)
                interval2()
            }
        }, time)
}
function cronometro () {
    seconds++
    if (seconds == 60) {
        minutes++
        seconds = 0
    }
    secondsEl.innerHTML = seconds < 10 ? '0'+seconds : seconds
    minutesEl.innerHTML = minutes < 10 ? '0'+minutes : minutes
}
function addPoints(n) {
    points += n
    pointsEl.innerHTML = points
}
function lowPoints(n) {
    points -= n
    pointsEl.innerHTML = points
}
function lowFuel (n = 1) {
    fuel = fuel - n < 0 ? 0 : fuel - n
    fuelEl.style.width = fuel*2+'px'
    if(!fuel) {
        lose()
    }
}
function addFuel(n) {
    if(audios) {
        audioFuel.currentTime = 0.2
        audioFuel.play()
    }
    fuel = fuel+n > 30 ? 30 : fuel + n
    fuelEl.style.width = fuel*2+'px'
}
function fuelFall() {
    const time = random(3000, 7000)
    setTimeout(()=> {
        if (appearShips) {
            new Fuel()
            fuelFall()
        }
    }, time)
}
function explosion(coords) {
    if(audios) {
        audioExplosion.currentTime = 0.2
        audioExplosion.play()
    }
    let explosion = document.createElement('img')
    explosion.src = 'assets/explosion.gif'
    explosion.className = 'explosion'
    parallax.appendChild(explosion)
    explosion.style.top = coords.y - 70 +'px'
    explosion.style.left = coords.x+'px'
    setTimeout(()=> {
        deleteElement(explosion)
    }, 550)
}
function shoot (e) {
    if (flag) {
        if (e.keyCode == 32) new FriendBullet()
        flag = false
    }
}
function startGame() {
    if (!isStarted) {
        isStarted = true
        const principal = document.querySelector('.principal')
        const scores = document.querySelector('.scores')
        principal.style.transform = 'translateX(-100%)'
        scores.style.display = 'block'
        parallax.style.cursor = 'none'
        spaceship = new mainSpaceship()
        setTimeout(()=> {
            cronometer = setInterval(cronometro, 1000)
            fuelCounter = setInterval(lowFuel, 1000)
            fuelFall()
            interval()
            interval2()
            document.addEventListener('keyup', () => flag=true)
            document.addEventListener('keydown', shoot)
        }, 1000)
    }
}
window.onload = function() {
    const startButton = document.getElementById('start')
    start.addEventListener('click', startGame)
    const intervals = [10000,8500, 15000]
    const planets = [
        'jupiter',
        'mars',
        'uranus',
        'saturn',
        'planet-earth'
    ]
    parallax.style.backgroundPosition = '8000px'
    for (const interval of intervals) {
        setInterval(() => {
            const cond = random(2,0)
            if (cond) {
                const size = random(5,1)
                const planet = planets[random(4,0)]
                createPlanet(size, planet)
            }
        }, interval)
    }
}
function createPlanet(size, name) {
    let planet = document.createElement('img')
    planet.src = `assets/${name}.svg`
    planet.className = `planet size-${size}`
    planet.style.top = calcTop(planet.height)+'px'
    parallax.appendChild(planet)
    planet.addEventListener('animationend', e => deleteElement(e.target))
}
class Spaceship {
    constructor (imageName) {
        this.ship = document.createElement('img')
        this.ship.src = `assets/${imageName}.svg`
        this.ship.className = 'spaceship'
        parallax.appendChild(this.ship)
        this.ship.addEventListener('animationend', (e)=> {
            e.target.style.display = 'none'
            deleteElement(e.target)
            clearInterval(this.interval)
            enemys = enemys.filter(s => s.id !== this.id)
        })
    }
    followMouse () {
        window.addEventListener('mousemove', e => {
            if(appearShips) {
                const mediumWidth = this.ship.offsetWidth / 2
                const mediumHeight = this.ship.offsetHeight / 2
                this.ship.style.left = e.clientX - mediumWidth+'px'
                this.ship.style.top = e.clientY - mediumHeight +'px'
            }
        })
    }
    movement() {
        let speed = random(15,7)
        let timeMove = speed * 180
        let transition = random(timeMove+800, timeMove-800)
        this.ship.style.transition = transition+'ms'
        setInterval(() => {
            const eleccion = random(1,0)
            let movement
            const left = this.ship.offsetLeft
            const flag =  true
            movement = eleccion? random(left-180, left-300) : random(left+300, left+180)
            if (movement <= 0) movement = random(left+300, left+180)
            else if(movement >= window.screen.width - 100) movement = random(left-180, left-300)
            this.ship.style.left = movement+'px'
        },timeMove)
        this.ship.style.animationDuration = speed+'s'
    }
}
class mainSpaceship extends Spaceship {
    constructor () {
        super('mainSpaceShip')
        super.followMouse()
        this.interval = setInterval(this.detectCollision.bind(this), 70)
        this.ship.classList.add('main')
    }
    detectCollision() {
        const shipCoords = calcCoords(this.ship)
        for (const ship of ships) {
            const enemyCoords = calcCoords(ship.ship)
            if(isElementCollided(enemyCoords, shipCoords)) {
                ship.ship.style.opacity = 'none'
                deleteElement(ship.ship)
                lowFuel(fuel)
                if(!ship.type) {
                    ship.stopShoot()
                }
                ships = ships.filter(e => e.id != ship.id)
                enemys = enemys.filter(e => e.id != ship.id)
            }
        }
    }
}
class friendSpaceship extends Spaceship {
    constructor(left) {
        enemyCounter++
        super('friendSpaceShip')
        this.movement()
        this.id = enemyCounter
        this.type = 'Friend'
        this.ship.style.left = left +'px'
        this.ship.classList.add('enemy')
        ships.push(this)
        enemys.push(this)
    }
}
class enemySpaceShip extends Spaceship {
    constructor (left) {
        enemyCounter++
        super('spaceship')
        this.id = enemyCounter
        this.ship.style.left = left +'px'
        this.ship.classList.add('enemy')
        this.movement()
        this.interval = null
        this.shoot()
        ships.push(this)
        enemys.push(this)
    }

    stopShoot () {
        clearInterval(this.interval)
    }
    shoot() {
        this.interval = setInterval(()=>{
            new EnemyBullet(this.ship)
        }, 1000) 

    }
}   
class Bullet {
    constructor(ship, imageName, friend) {
        if(audios) {
            audioShoot.currentTime = 0.1
            audioShoot.play()
        }
        this.interval = null
        this.ship = ship
        this.friend = friend
        this.collisioned = false
        this.bullet = document.createElement('img')
        this.bullet.src = `assets/${imageName}.svg`
        this.bullet.className = 'bullet'
        if(!friend) {
            this.bullet.classList.add('enemy-bullet')
        }
        parallax.appendChild(this.bullet)
        const initialTop = friend ? ship.offsetTop : ship.offsetTop + ship.offsetHeight
        this.bullet.style.left = this.calcCenter(ship) + 'px'
        this.bullet.style.top = initialTop + 'px'
        this.bullet.style.animationDuration = this.calcTime(initialTop) + 's'
        this.interval = setInterval(this.detectCollision.bind(this) ,70)
        this.bullet.addEventListener('animationend', (e) => {
            deleteElement(e.target)
            clearInterval(this.interval)
        })
    }
    calcTime(top) {
        const height = window.screen.height + window.screen.height * .1
        const distance = this.friend ? top : height - top
        const v = height / 3
        return distance / v
    }
    detectCollision() {
        if(!this.collisioned) {
            let collisionables = []
            if (!this.friend) collisionables.push(spaceship)
            else collisionables = enemys
            const bulletCoords = calcCoords(this.bullet)
            for (const enemy of collisionables) {
                enemyCoords = calcCoords(enemy.ship)
                if (isElementCollided(bulletCoords,enemyCoords)) {
                    this.collisioned = true
                    this.bullet.style.display='none'
                    explosion(bulletCoords.p1)
                    if(this.friend) {
                            enemy.ship.style.transition = '.2s'
                            enemy.ship.style.opacity = '0'
                            enemys = enemys.filter(e => e.id !== enemy.id)
                            ships = ships.filter(e => e.id !== enemy.id)
                            clearInterval(this.interval)
                        if (enemy.type != 'Friend') {
                            addPoints(5)
                            enemy.stopShoot()
                        } else {
                            lowPoints(10)
                        }
                        return
                    } else {
                        lowPoints(5)
                        lowFuel(15)
                    }
                }
            }
        }
    }
    calcCenter(ship) {
        const shipWidth = ship.offsetWidth/2
        const bulletWidth = this.bullet.offsetWidth/2
        return ship.offsetLeft + shipWidth - bulletWidth
    }
}
class FriendBullet extends Bullet {
    constructor() {
        super(spaceship.ship, 'mainBullet', true)
    }
}
class EnemyBullet extends Bullet {
    constructor (ship) {
        super(ship, 'enemyBullet', false)       
    }
}
class Fuel {
    constructor(){
        this.collided = false
        this.element = document.createElement('img')
        this.element.src = 'assets/fuel.svg'
        this.element.className = 'fuel'
        this.element.style.top = -100+'px'
        const left = random(document.body.offsetWidth - 80, 0)
        this.element.style.left = left + 'px'
        this.interval = setInterval(this.detectCollision.bind(this) ,70)
        parallax.appendChild(this.element)
    }
    detectCollision() {
        if (!this.collided) {
            const fuelCoords = calcCoords(this.element)
            const shipCoords = calcCoords(spaceship.ship)
            if(isElementCollided(fuelCoords, shipCoords)) {
                this.collided = true
                let more = document.createElement('div')
                more.className = 'more'
                more.innerHTML = '+15'
                more.style.top = fuelCoords.p1.y + 20 + 'px'
                more.style.left = fuelCoords.p1.x + 20 + 'px'
                this.element.style.display = 'none'
                parallax.appendChild(more)
                more.addEventListener('animationend', ()=> {
                    deleteElement(more)
                })
                addFuel(15)
            }
        }
    }
}