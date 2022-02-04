export class Foo {
    constructor(isInternal1, isInternal2, isInternal3, isInternal4, isInternal5, isInternal6, isInternal7, notInternal1, notInternal2, notInternal3){
        this.isInternal1 = isInternal1, this.isInternal2 = isInternal2, this.isInternal3 = isInternal3, this.isInternal4 = isInternal4, this.isInternal5 = isInternal5, this.isInternal6 = isInternal6, this.isInternal7 = isInternal7, this.notInternal1 = notInternal1, this.notInternal2 = notInternal2, this.notInternal3 = notInternal3;
    }
}
export class Bar {
    constructor(isInternal1){
        this.isInternal1 = isInternal1;
    }
}
export class Baz {
    constructor(isInternal){
        this.isInternal = isInternal;
    }
}
