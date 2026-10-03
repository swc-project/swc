// The closure must retain the outer class's private-name environment.
const outer = new class {
    #x = 1;
    make() {
        let f = async (object)=>object.#x;
        return new class {
            #x = 2;
            m(object) {
                return console.log(this.#x), f(object);
            }
        }();
    }
}();
outer.make().m(outer).then(console.log, (error)=>console.log(error.name));
