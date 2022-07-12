namespace contraption {
    export class Vec2 {
        constructor(public x: number, public y: number) { }

        public static One(): Vec2 {
            return mkVec2(1, 1);
        }

        public static Add(a: Vec2, b: Vec2): Vec2 {
            return new Vec2(
                a.x + b.x,
                a.y + b.y
            );
        }
        public add(v: Vec2): this {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        public static Sub(a: Vec2, b: Vec2): Vec2 {
            return new Vec2(
                a.x - b.x,
                a.y - b.y
            );
        }
        public sub(v: Vec2): this {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        public static Mul(a: Vec2, b: Vec2): Vec2 {
            return new Vec2(
                a.x * b.x,
                a.y * b.y
            );
        }
        public mul(v: Vec2): this {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        }

        public static Sign(v: Vec2): Vec2 {
            return new Vec2(
                v.x < 0 ? -1 : 1,
                v.y < 0 ? -1 : 1
            );
        }

        public static Abs(v: Vec2): Vec2 {
            return new Vec2(
                Math.abs(v.x),
                Math.abs(v.y)
            );
        }

        public static Transpose(v: Vec2): Vec2 {
            return new Vec2(v.y, v.x);
        }

        public static Neg(v: Vec2): Vec2 {
            return new Vec2(-v.x, -v.y);
        }

        public static Normal(v: Vec2, mag?: number): Vec2 {
            if (!mag) {
                const magSq = (v.x * v.x + v.y * v.y);
                if (magSq === 1) { return v; }
                mag = Math.sqrt(magSq);
            }
            return new Vec2(
                v.x / mag,
                v.y / mag
            );
        }

        public static Scale(v: Vec2, scalar: number): Vec2 {
            return new Vec2(
                v.x * scalar,
                v.y * scalar
            );
        }
        public scale(scalar: number): this {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        public static Magnitude(v: Vec2): number {
            const magSq = (v.x * v.x + v.y * v.y);
            return Math.sqrt(magSq);
        }
        public magnitude(): number {
            return Math.sqrt(this.magnitudeSq());
        }

        public static MagnitudeSq(v: Vec2): number {
            return (v.x * v.x + v.y * v.y);
        }
        public magnitudeSq(): number {
            return Vec2.MagnitudeSq(this);
        }

        public static Dot(a: Vec2, b: Vec2): number {
            return a.x * b.x + a.y * b.y;
        }

        public static Determinant(a: Vec2, b: Vec2): number {
            return a.x * b.y - a.y * b.x;
        }

        public static DistanceSq(a: Vec2, b: Vec2): number {
            const d = Vec2.Sub(a, b);
            return (d.x * d.x) + (d.y * d.y);
        }

        public static Distance(a: Vec2, b: Vec2): number {
            return Math.sqrt(Vec2.DistanceSq(a, b));
        }
    }

    export function mkVec2(x = 0, y = 0): Vec2 {
        return new Vec2(x, y);
    }
}
