import { _ as _define_property } from "@swc/helpers/_/_define_property";
new class Foo {
    constructor(b = (console.log(2), 2)){
        this.b = b;
        _define_property(this, "b", void 0);
        _define_property(this, "a", (console.log(1), 1));
    }
};
