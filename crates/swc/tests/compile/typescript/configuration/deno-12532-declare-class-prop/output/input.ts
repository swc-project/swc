export class Foo {
    x;
    constructor(x){
        this.x = x;
    }
}
export class Bar extends Foo {
    constructor(){
        super(123);
    }
}
