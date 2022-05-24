// @declaration: true
// @strict: true
// @target: es5
// In methods of an object literal with no contextual type, 'this' has the type
// of the object literal.
let obj1 = {
    a: 1,
    f () {
        return this.a;
    },
    b: "hello",
    c: {
        g () {
            this.g();
        }
    },
    get d () {
        return this.a;
    },
    get e () {
        return this.b;
    },
    set e (value){
        this.b = value;
    }
};
let p1 = {
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
let p2 = {
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
let p3 = {
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
let p4 = {
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
f1({
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
});
f2({
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
});
let x1 = makeObject({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy (dx, dy) {
            this.x += dx; // Strongly typed this
            this.y += dy; // Strongly typed this
        }
    }
});
let x2 = makeObject2({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy (dx, dy) {
            this.x += dx; // Strongly typed this
            this.y += dy; // Strongly typed this
        }
    }
});
let p10 = defineProp(p1, "foo", {
    value: 42
});
p10.foo = p10.foo + 1;
let p11 = defineProp(p1, "bar", {
    get () {
        return this.x;
    },
    set (value) {
        this.x = value;
    }
});
p11.bar = p11.bar + 1;
let p12 = defineProps(p1, {
    foo: {
        value: 42
    },
    bar: {
        get () {
            return this.x;
        },
        set (value) {
            this.x = value;
        }
    }
});
p12.foo = p12.foo + 1;
p12.bar = p12.bar + 1;
let vue = new Vue({
    data: ()=>({
            x: 1,
            y: 2
        }),
    methods: {
        f (x) {
            return this.x;
        }
    },
    computed: {
        test () {
            return this.x;
        },
        hello: {
            get () {
                return "hi";
            },
            set (value) {}
        }
    }
});
vue;
vue.x;
vue.f("abc");
vue.test;
vue.hello;
