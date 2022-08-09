export default 12;
export default function foo() {
    return foo;
};
export const x = foo;
export { foo as bar };
class Foo {
    constructor(){
        this.a = null;
    }
}
export const X = Foo;
export { Foo as default, Foo as Bar };
import Fab from "./index3";
export default class extends Fab {
    constructor(...args){
        super(...args), this.x = null;
    }
};
export default 12;
export default function func() {};
