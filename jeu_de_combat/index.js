const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
//plus le chiffre est grand , plus la gravité est forte et donc le joueur saute moins haut
const gravity = 0.6

const background = new Sprite({
position: {
    x: 0,
    y: 0
},
imageSrc:'./img/background2.png'
})
const player = new Fighter({
    position: {
    x: 0,
    y: 0
 },
   velocity: {
    x: 0,
    y: 0
 },
 offset: {
    x: 0,
    y: 0
 }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

console.log(player)

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    // player.velocity (plus le chiffre est grand , plus la vitesse augmente)
    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }
    // detection de colision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking 
    ) { 
        //cette ligne permet de donner que 1 hit et pas une boucle de hit
        player.isAttacking = false
        //baisse la vie de l enemy en %
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking 
    ) { 
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    //game over par la vie
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({player, enemy, timerId })
    }
}
 
animate()

window.addEventListener('keydown' , (event) => {

    //player keys
switch (event.key) {
    case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
     break
     case 'q':
        keys.q.pressed = true
        player.lastKey = 'q'
     break
     case 'z':
        player.velocity.y = -20
     break
     case ' ':
        player.attack()
     break

    //enemy keys
     case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        
     break
     case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
       enemy.lastKey = 'ArrowLeft'
     break
     case 'ArrowUp':
        enemy.velocity.y = -20
     break
     case 'ArrowDown':
        enemy.attack()
     break
}
})

window.addEventListener('keyup' , (event) => {
    //player key
    switch (event.key) {
        case 'd':
         keys.d.pressed = false
         break
         case 'q':
         keys.q.pressed = false
         break
    }

    // enemy keys
    switch (event.key) {
    case 'ArrowRight':
         keys.ArrowRight.pressed = false
         break
         case 'ArrowLeft':
         keys.ArrowLeft.pressed = false
         break
    }
        console.log(event)
})