class Base {
    ["longprop"]() { return 1; }
}
class Child extends Base {
    read() { return super[("longprop")](); }
}
const obj = new Child();
console.log(obj.read(), obj["longprop"](), "longprop" in obj);
