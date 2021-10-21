let p1 = {
    x: 10,
    y: 20,
    moveBy (dx, dy, dz) {
        this.x += dx, this.y += dy, this.z && dz && (this.z += dz);
    }
};
f1({
    x: 10,
    y: 20,
    moveBy (dx1, dy1, dz1) {
        this.x += dx1, this.y += dy1, this.z && dz1 && (this.z += dz1);
    }
}), f2({
    x: 10,
    y: 20,
    moveBy (dx2, dy2, dz2) {
        this.x += dx2, this.y += dy2, this.z && dz2 && (this.z += dz2);
    }
}), makeObject({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy (dx3, dy3) {
            this.x += dx3, this.y += dy3;
        }
    }
}), makeObject2({
    data: {
        x: 0,
        y: 0
    },
    methods: {
        moveBy (dx4, dy4) {
            this.x += dx4, this.y += dy4;
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
p12.foo = p12.foo + 1, p12.bar = p12.bar + 1;
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
vue.x, vue.f("abc"), vue.test, vue.hello;
