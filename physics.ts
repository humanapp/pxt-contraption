namespace contraption {
    // Force our physics engine on the scene
    game.addScenePushHandler((_ => {
        game.currentScene().physicsEngine = new MyPhysicsEngine();
    }));
    game.pushScene();

    let __bodyIdSequence = 0;

    export class Body {
        id: number;
        enabled: boolean;
        pos: Vec2;
        vel: Vec2;
        impulse: Vec2;
        friction: Vec2;
        mass: number;
        radius: number;
        restitution: number;
        bumpCanMove: boolean;
        applyGravity: boolean;
        bounceOffWalls: boolean;
        continuousFriction: boolean;    // always apply friction, or only when colliding?

        // per-frame state
        colliding: boolean;

        constructor() {
            this.id = ++__bodyIdSequence;
            this.enabled = true;
            this.pos = mkVec2();
            this.vel = mkVec2();
            this.impulse = mkVec2();
            this.friction = mkVec2(1, 1);
            this.mass = 1;
            this.restitution = 1;
            this.bumpCanMove = true;
            this.applyGravity = true;
            this.bounceOffWalls = true;
            this.continuousFriction = true;
        }

        resetForFrame() {
            this.colliding = false;
        }

        syncIn() { }
        syncOut() { }
        clearObstacles() { }
        registerObstacle(direction: CollisionDirection, other: sprites.Obstacle, tm?: tiles.TileMap) { }

        update(dt: number) {
            this.vel.add(Vec2.Scale(this.impulse, dt));
            if (this.colliding || this.continuousFriction)
                this.vel.mul(Vec2.Sub(Vec2.One(), this.friction));
            this.pos.add(Vec2.Scale(this.vel, dt));
            this.impulse.x = this.impulse.y = 0;
        }
    }

    export class WrappedSprite extends Body {
        constructor(private sprite: Sprite) {
            super();
            const hitbox = util.calculateHitboxForSprite(this.sprite);
            this.radius = Math.max(hitbox.width, hitbox.height) >> 1;
        }

        syncIn() {
            this.pos.x = this.sprite.x;
            this.pos.y = this.sprite.y;
            this.vel.x = this.sprite.vx;
            this.vel.y = this.sprite.vy;
            this.impulse.x += this.sprite.ax;
            this.impulse.y += this.sprite.ay;
            this.sprite.ax = 0;
            this.sprite.ay = 0;
            this.friction.x = this.sprite.fx;
            this.friction.y = this.sprite.fy;
        }

        syncOut() {
            this.sprite.x = this.pos.x;
            this.sprite.y = this.pos.y;
            this.sprite.vx = this.vel.x;
            this.sprite.vy = this.vel.y;
            this.sprite.fx = this.friction.x;
            this.sprite.fy = this.friction.y;
        }

        clearObstacles() {
            this.sprite.clearObstacles();
        }

        registerObstacle(direction: CollisionDirection, other: sprites.Obstacle, tm?: tiles.TileMap) {
            this.sprite.registerObstacle(direction, other, tm);
        }
    }

    export class MyPhysicsEngine extends PhysicsEngine {
        maxVelocity: number;
        maxNegativeVelocity: number;
        minSingleStep: number;
        maxSingleStep: number;
        gravity: number;
        bodies: Body[];
        wall: Body;

        constructor(maxVelocity = 500, minSingleStep = 2, maxSingleStep = 4) {
            super();
            this.bodies = [];
            this.maxVelocity = maxVelocity;
            this.maxNegativeVelocity = -this.maxVelocity;
            this.minSingleStep = minSingleStep;
            this.maxSingleStep = maxSingleStep;
            this.gravity = 200;
            this.wall = new Body();
            this.wall.bumpCanMove = false;
            this.wall.mass = 10000;
            this.wall.radius = 10000;
            this.wall.restitution = 0.9;
        }

        addSprite(sprite: Sprite) {
            const body = new WrappedSprite(sprite);
            if (sprite.data["__body"]) return;
            sprite.data["__body"] = body;
            body.syncIn();
            this.bodies.push(body);
            const tm = game.currentScene().tileMap;
            if (tm && tm.isOnWall(sprite)) {
                sprite.flags |= sprites.Flag.IsClipping;
            }
        }

        removeSprite(sprite: Sprite) {
            const body = sprite.data["__body"];
            if (body) {
                delete sprite.data["__body"];
                this.bodies.removeElement(body);
            }
        }

        moveSprite(s: Sprite, dx: Fx8, dy: Fx8) {
            s._lastX = s._x;
            s._lastY = s._y;
            s._x = Fx.add(s._x, dx);
            s._y = Fx.add(s._y, dy);
        }

        draw() { }

        move(dt: number) {
            const bodies = this.bodies.slice();

            // Sync from sprites
            bodies.forEach(p => p.syncIn());
            // Reset for frame
            bodies.forEach(p => p.resetForFrame());

            // Apply gravity
            const g = this.gravity * dt;
            bodies.forEach(p => { if (p.applyGravity) p.vel.y += g });

            // Update physics state
            bodies.forEach(p => p.update(dt));

            // Check collisions
            for (let i = 0; i < bodies.length; ++i) {
                const body1 = bodies[i];
                if (!body1.enabled) { continue; }
                for (let j = i + 1; j < bodies.length; ++j) {
                    const body2 = bodies[j];
                    if (!body2.enabled) { continue; }
                    this.checkCollision(body1, body2);
                }
                if (body1.bounceOffWalls) {
                    this.checkWalls(body1);
                }
            }

            // Apply hard constraints
            bodies.forEach(p => this.applyConstraints(p));

            // Sync to sprites
            bodies.forEach(p => p.syncOut());
        }

        setMaxSpeed(speed: number) { }

        overlaps(sprite: Sprite): Sprite[] { return []; }


        checkCollision(body1: Body, body2: Body) {
            const minDist = (body1.radius + body2.radius);
            const minDistSq = (minDist * minDist);
            const vPosDiff = Vec2.Sub(body2.pos, body1.pos);
            const magSq = vPosDiff.magnitudeSq();
            if (magSq > minDistSq) return; // not colliding
            body1.colliding = true;
            body2.colliding = true;
            const mag = Math.sqrt(magSq);
            const vPosDiffNorm = Vec2.Normal(vPosDiff, mag);
            this.applyCollision(body1, body2, vPosDiffNorm);
        }

        checkWalls(body: Body) {
            this.wall.pos.x = body.pos.x;
            this.wall.pos.y = screen.height + this.wall.radius;
            this.checkCollision(body, this.wall);
            this.wall.pos.y = -this.wall.radius;
            this.checkCollision(body, this.wall);
            this.wall.pos.y = body.pos.y;
            this.wall.pos.x = screen.width + this.wall.radius;
            this.checkCollision(body, this.wall);
            this.wall.pos.x = -this.wall.radius;
            this.checkCollision(body, this.wall);
        }

        applyCollision(body1: Body, body2: Body, vNorm: Vec2) {
            const vVelDiff = Vec2.Sub(body1.vel, body2.vel);
            let speed = Vec2.Dot(vVelDiff, vNorm);
            if (speed < 0) return; // moving away from each other
            speed *= Math.min(body1.restitution, body2.restitution);
            const impulse = 2 * speed / (body1.mass + body2.mass);
            body1.vel = Vec2.Sub(body1.vel, Vec2.Scale(vNorm, impulse * body2.mass));
            body2.vel = Vec2.Add(body2.vel, Vec2.Scale(vNorm, impulse * body1.mass));
        }

        applyConstraints(body: Body) {
            if (body.bounceOffWalls) {
                if (body.pos.x < body.radius) {
                    body.pos.x = body.radius;
                } else if (body.pos.x > screen.width - body.radius) {
                    body.pos.x = screen.width - body.radius;
                }
                if (body.pos.y < body.radius) {
                    body.pos.y = body.radius;
                } else if (body.pos.y > screen.height - body.radius) {
                    body.pos.y = screen.height - body.radius;
                }
            }
        }
    }
}
