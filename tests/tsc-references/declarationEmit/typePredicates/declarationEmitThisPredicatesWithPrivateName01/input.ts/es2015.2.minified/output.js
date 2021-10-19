export class C {
    m() {
        return this instanceof D;
    }
}
class D extends C {
}
