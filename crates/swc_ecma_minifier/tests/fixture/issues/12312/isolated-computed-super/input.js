class Child extends ExternalBase {
    get() {
        return super["longprop"]();
    }
}
