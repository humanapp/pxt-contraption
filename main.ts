let mySprite2: Sprite = null
let n = 0
let i = 0
contraption.setWallBounciness(0.6)
contraption.setGravity(0)
let mySprite = sprites.create(img`
    . . . . . . f f f f . . . . . . 
    . . . . f f f 2 2 f f f . . . . 
    . . . f f f 2 2 2 2 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f f e 2 2 2 2 2 2 e e f . . 
    . . f e 2 f f f f f f 2 e f . . 
    . . f f f f e e e e f f f f . . 
    . f f e f b f 4 4 f b f e f f . 
    . f e e 4 1 f d d f 1 4 e e f . 
    . . f e e d d d d d d e e f . . 
    . . . f e e 4 4 4 4 e e f . . . 
    . . e 4 f 2 2 2 2 2 2 f 4 e . . 
    . . 4 d f 2 2 2 2 2 2 f d 4 . . 
    . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . f f . . f f . . . . . 
    `, SpriteKind.Player)
mySprite.x = 30
mySprite.ay = -5000
mySprite.vx = 400
mySprite.fx = 0.05
mySprite.fy = 0.05
contraption.bounceOffWalls(mySprite, true)
contraption.setMass(mySprite, 50)
for (let index = 0; index <= 3; index++) {
    i = index
    for (let index = 0; index <= i; index++) {
        n = index + 0
        mySprite2 = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . 6 6 6 6 . . . . . . 
            . . . . 6 6 6 5 5 6 6 6 . . . . 
            . . . 7 7 7 7 6 6 6 6 6 6 . . . 
            . . 6 7 7 7 7 8 8 8 1 1 6 6 . . 
            . . 7 7 7 7 7 8 8 8 1 1 5 6 . . 
            . 6 7 7 7 7 8 8 8 8 8 5 5 6 6 . 
            . 6 7 7 7 8 8 8 6 6 6 6 5 6 6 . 
            . 6 6 7 7 8 8 6 6 6 6 6 6 6 6 . 
            . 6 8 7 7 8 8 6 6 6 6 6 6 6 6 . 
            . . 6 8 7 7 8 6 6 6 6 6 8 6 . . 
            . . 6 8 8 7 8 8 6 6 6 8 6 6 . . 
            . . . 6 8 8 8 8 8 8 8 8 6 . . . 
            . . . . 6 6 8 8 8 8 6 6 . . . . 
            . . . . . . 6 6 6 6 . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Player)
        mySprite2.x = 80 + mySprite.width * n
        mySprite2.fx = 0
        mySprite2.fy = 0
    }
}
forever(function () {
    if (controller.up.isPressed()) {
        contraption.applyImpulse(mySprite, 0, -3500)
    }
    if (controller.down.isPressed()) {
        contraption.applyImpulse(mySprite, 0, 2000)
    }
    if (controller.left.isPressed()) {
        contraption.applyImpulse(mySprite, -2000, 0)
    }
    if (controller.right.isPressed()) {
        contraption.applyImpulse(mySprite, 2000, 0)
    }
})
