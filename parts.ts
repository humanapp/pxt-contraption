namespace contraption {

    export class Connection {
        constructor(public port: string, public part: Part) {
        }
    }

    export class Part extends sprites.BaseSprite {
        // Port definitions
        inports: string[];
        outports: string[];

        // Port connections
        inputs: Connection[];
        outputs: Connection[];

        constructor(public name: string) {
            super(0);
            this.inports = [];
            this.outports = [];
            this.inputs = [];
            this.outputs = [];
        }

        /*virtual*/ update() {
        }

        /*virtual*/ draw() {
        }
    }
}