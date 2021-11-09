// @declaration: true
// @module: commonjs
export class C {
    m() {
        return this instanceof D;
    }
}
export class D extends C {
}
