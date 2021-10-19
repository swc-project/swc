class Base {
    constructor(){
    }
}
class Derived extends Base {
    static make() {
        new Base();
    }
}
class Unrelated {
    static fake() {
        new Base();
    }
}
