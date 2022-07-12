namespace contraption {
    //% block
    export function bounceOffWalls(s: Sprite, bounce: boolean) {
        const body = s.data["__body"] as Body;
        if (!body) return;
        body.bounceOffWalls = bounce;
    }

    //% block
    export function applyImpulse(s: Sprite, x: number, y: number) {
        const body = s.data["__body"] as Body;
        if (!body) return;
        body.impulse.x += x;
        body.impulse.y += y;
    }

    //% block
    export function setBounciness(s: Sprite, b: number) {
        const body = s.data["__body"] as Body;
        if (!body) return;
        body.restitution = b;
    }

    //% block
    export function setMass(s: Sprite, mass: number) {
        const body = s.data["__body"] as Body;
        if (!body) return;
        body.mass = mass;
    }

    //% block
    export function setWallBounciness(b: number) {
        const physics = game.currentScene().physicsEngine as MyPhysicsEngine;
        physics.wall.restitution = b;
    }

    //% block
    export function setGravity(g: number) {
        const physics = game.currentScene().physicsEngine as MyPhysicsEngine;
        physics.gravity = g;
    }
}
