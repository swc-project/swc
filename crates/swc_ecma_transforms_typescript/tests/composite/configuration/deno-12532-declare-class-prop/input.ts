
    export class Foo {
        x: number;
        constructor(x: number) {
            this.x = x;
        }
    }
    export class Bar extends Foo {
        declare x: 123;
        constructor() {
            super(123);
        }
    }
