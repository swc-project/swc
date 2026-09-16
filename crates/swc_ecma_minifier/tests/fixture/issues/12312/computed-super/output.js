class Base {
    e() {
        return 1;
    }
}
class Child extends Base {
    get() {
        return super["e"]();
    }
}
console.log(new Child().get());
