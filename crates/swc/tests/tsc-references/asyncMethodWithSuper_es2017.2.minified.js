//// [asyncMethodWithSuper_es2017.ts]
class A {
    x() {}
    y() {}
}
class B extends A {
    async simple() {
        super.x(), super.y(), super.x(), super.x, super.x;
    }
    async advanced() {
        let f = ()=>{};
        super.x(), super.x(), super.x, super.x, super.x = f, super.x = f, ({ f: super.x  } = {
            f
        }), { f: super.x  } = {
            f
        };
    }
}
