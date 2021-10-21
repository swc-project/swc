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
    moveBy (dx1, dy1, dz1) {
        this.x += dx1;
        this.y += dy1;
        if (this.z && dz1) {
            this.z += dz1;
        }
    }
};
let p3 = {
    x: 10,
    y: 20,
    moveBy (dx2, dy2, dz2) {
        this.x += dx2;
        this.y += dy2;
        if (this.z && dz2) {
            this.z += dz2;
        }
    }
};
let p4 = {
    x: 10,
    y: 20,
    moveBy (dx3, dy3, dz3) {
        this.x += dx3;
        this.y += dy3;
        if (this.z && dz3) {
            this.z += dz3;
        }
    }
};
f1({
    x: 10,
    y: 20,
    moveBy (dx4, dy4, dz4) {
        this.x += dx4;
        this.y += dy4;
        if (this.z && dz4) {
            this.z += dz4;
        }
    }
});
f2({
    x: 10,
    y: 20,
    moveBy (dx5, dy5, dz5) {
        this.x += dx5;
        this.y += dy5;
        if (this.z && dz5) {
            this.z += dz5;
        }
    }
});
let x1 = makeObject({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy (dx6, dy6) {
            this.x += dx6; // Strongly typed this
            this.y += dy6; // Strongly typed this
        }
    }
});
let x2 = makeObject2({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy (dx7, dy7) {
            this.x += dx7; // Strongly typed this
            this.y += dy7; // Strongly typed this
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
        set (value1) {
            this.x = value1;
        }
    }
});
p12.foo = p12.foo + 1;
p12.bar = p12.bar + 1;
let vue = new Vue({
    data: ()=>({
            x: 1,
            y: 2
        })
    ,
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
            set (value2) {
            }
        }
    }
});
vue;
vue.x;
vue.f("abc");
vue.test;
vue.hello;
