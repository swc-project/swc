class Base {
    longprop() {
        return 1;
    }
}

class Child extends Base {
    get() {
        return super["longprop"]();
    }
}

console.log(new Child().get());
