// The closure must retain the outer class's private-name environment.
class Outer {
    #x = 1;
    make() {
        const f = async object => object.#x;
        return new class {
            #x = 2;
            m(object) {
                console.log(this.#x);
                return f(object);
            }
        }();
    }
}
const outer = new Outer();
outer.make().m(outer).then(console.log, error => console.log(error.name));
