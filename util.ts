namespace contraption {
    export class Hitbox {
        constructor(
            public width: number,
            public height: number,
            public minX: number,
            public minY: number) { }
    }

    export class util {
        public static calculateHitboxForSprite(s: Sprite): Hitbox {
            const i = s.image;
            let minX = i.width;
            let minY = i.height;
            let maxX = 0;
            let maxY = 0;

            for (let col = 0; col < i.width; ++col) {
                for (let row = 0; row < i.height; ++row) {
                    if (i.getPixel(col, row)) {
                        minX = Math.min(minX, col);
                        minY = Math.min(minY, row);
                        maxX = Math.max(maxX, col);
                        maxY = Math.max(maxY, row);
                    }
                }
            }

            const width = maxX - minX + 1;
            const height = maxY - minY + 1;
            minX -= i.width >> 1;
            minY -= i.height >> 1;

            return new Hitbox(width, height, minX, minY);
        }
    }
}