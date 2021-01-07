// @target: es6

class C1<T, U, V> {
    constructor(private k: T, protected [a, b, c]: [T, U, V]) {
        if ((b === undefined && c === undefined) || (this.b === undefined && this.c === undefined)) {
            this.a = a || k;
        }
    }

    pu

}
