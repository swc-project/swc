// @declaration: true
// @strict: true
// @target: es5
// In methods of an object literal with no contextual type, 'this' has the type
// of the object literal.
var obj1 = {
    a: 1,
    f: function f() {
        return this.a;
    },
    b: "hello",
    c: {
        g: function g() {
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
var p1 = {
    x: 10,
    y: 20,
    moveBy: function moveBy(dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
var p2 = {
    x: 10,
    y: 20,
    moveBy: function moveBy(dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
var p3 = {
    x: 10,
    y: 20,
    moveBy: function moveBy(dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
};
var p4 = {
    x: 10,
    y: 20,
    moveBy: function moveBy(dx, dy, dz) {
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
    moveBy: function moveBy(dx, dy, dz) {
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
    moveBy: function moveBy(dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        if (this.z && dz) {
            this.z += dz;
        }
    }
});
var x1 = makeObject({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy: function moveBy(dx, dy) {
            this.x += dx; // Strongly typed this
            this.y += dy; // Strongly typed this
        }
    }
});
var x2 = makeObject2({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy: function moveBy(dx, dy) {
            this.x += dx; // Strongly typed this
            this.y += dy; // Strongly typed this
        }
    }
});
var p10 = defineProp(p1, "foo", {
    value: 42
});
p10.foo = p10.foo + 1;
var p11 = defineProp(p1, "bar", {
    get: function get() {
        return this.x;
    },
    set: function set(value1) {
        this.x = value1;
    }
});
p11.bar = p11.bar + 1;
var p12 = defineProps(p1, {
    foo: {
        value: 42
    },
    bar: {
        get: function get() {
            return this.x;
        },
        set: function set(value1) {
            this.x = value1;
        }
    }
});
p12.foo = p12.foo + 1;
p12.bar = p12.bar + 1;
var vue = new Vue({
    data: function() {
        return {
            x: 1,
            y: 2
        };
    },
    methods: {
        f: function f(x) {
            return this.x;
        }
    },
    computed: {
        test: function test() {
            return this.x;
        },
        hello: {
            get: function get() {
                return "hi";
            },
            set: function set(value1) {}
        }
    }
});
vue;
vue.x;
vue.f("abc");
vue.test;
vue.hello;
