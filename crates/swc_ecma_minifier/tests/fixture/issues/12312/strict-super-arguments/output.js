const seed = {
    e: 0
};
class ExternalBase {
    ["longprop"]() {
        return "PASS";
    }
}
class Child extends ExternalBase {
    get() {
        return super["longprop"]();
    }
}
console.log(new Child().get(), seed.e);
