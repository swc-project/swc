// @declaration: true
// @strict: true
// @target: es5
// In methods of an object literal with no contextual type, 'this' has the type
// of the object literal.
var obj1 = {
    a: 1,
    f: function() {
        return this.a;
    },
    b: "hello",
    c: {
        g: function() {
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
    moveBy: function(dx, dy, dz) {
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
    moveBy: function(dx, dy, dz) {
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
    moveBy: function(dx, dy, dz) {
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
    moveBy: function(dx, dy, dz) {
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
    moveBy: function(dx, dy, dz) {
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
    moveBy: function(dx, dy, dz) {
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
        moveBy: function(dx, dy) {
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
        moveBy: function(dx, dy) {
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
    get: function() {
        return this.x;
    },
    set: function(value) {
        this.x = value;
    }
});
p11.bar = p11.bar + 1;
var p12 = defineProps(p1, {
    foo: {
        value: 42
    },
    bar: {
        get: function() {
            return this.x;
        },
        set: function(value) {
            this.x = value;
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
        f: function(x) {
            return this.x;
        }
    },
    computed: {
        test: function() {
            return this.x;
        },
        hello: {
            get: function() {
                return "hi";
            },
            set: function(value) {
            }
        }
    }
});
vue;
vue.x;
vue.f("abc");
vue.test;
vue.hello;
