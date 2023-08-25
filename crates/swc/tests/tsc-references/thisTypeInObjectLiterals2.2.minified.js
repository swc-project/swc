//// [thisTypeInObjectLiterals2.ts]
// In methods of an object literal with no contextual type, 'this' has the type
// of the object literal.
var p1 = {
    x: 10,
    y: 20,
    moveBy: function(dx, dy, dz) {
        this.x += dx, this.y += dy, this.z && dz && (this.z += dz);
    }
};
f1({
    x: 10,
    y: 20,
    moveBy: function(dx, dy, dz) {
        this.x += dx, this.y += dy, this.z && dz && (this.z += dz);
    }
}), f2({
    x: 10,
    y: 20,
    moveBy: function(dx, dy, dz) {
        this.x += dx, this.y += dy, this.z && dz && (this.z += dz);
    }
}), makeObject({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy: function(dx, dy) {
            this.x += dx, this.y += dy;
        }
    }
}), makeObject2({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy: function(dx, dy) {
            this.x += dx, this.y += dy;
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
    set: function(value1) {
        this.x = value1;
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
        set: function(value1) {
            this.x = value1;
        }
    }
});
p12.foo = p12.foo + 1, p12.bar = p12.bar + 1;
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
            set: function(value1) {}
        }
    }
});
vue.x, vue.f("abc"), vue.test, vue.hello;
