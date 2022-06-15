// @noImplicitThis: true
// @strict: true
class Test {
    constructor(){
        this.data = {};
        var copy = {};
    }
}
class Test1 {
    constructor(){
        this.data = {
            foo: ''
        };
        this['this'] = '';
        var copy = {
            foo: ''
        };
        var foo = '';
        var self = this;
        self.data;
        var str = '';
    }
}
function Test2() {
    let x = 1;
}
function Test3() {
    let x = 1;
}
function Test4() {
    let x = 1;
}
class Test5 {
    constructor(){
        this.no = 1;
        this.f = ()=>{
            // should not capture this.
            let x = 1;
        };
    }
}
var Test6;
(function(Test6) {
    var f = Test6.f = ()=>{
        let x = 1;
    };
})(Test6 || (Test6 = {}));
var Test7;
(function(Test7) {
    var f = Test7.f = ()=>{
        let x = 1;
    };
})(Test7 || (Test7 = {}));
const Test8 = ()=>{
    let x = 1;
};
class Test9 {
    f() {
        if (this instanceof Test9D1) {
            const d1 = this;
            d1.f1();
        }
        if (this instanceof Test9D2) {
            const d2 = this;
            d2.f2();
        }
    }
    g() {
        if (this.no === 1) {
            const no = this.no;
        }
        if (this.this === 1) {
            const no1 = this.this;
        }
    }
    constructor(){
        this.no = 0;
        this.this = 0;
    }
}
class Test9D1 {
    f1() {}
}
class Test9D2 {
    f2() {}
}
class Test10 {
    foo() {
        let a = undefined;
        if (this.a) {
            let a1 = undefined; // should narrow to { b?: string }
            let b = undefined;
            if (this.a.b) {
                let b1 = undefined; // should narrow to string
            }
        }
    }
}
class Test11 {
    foo() {
        const o = this;
        let bar = {};
        if (o.this && o.this.x) {
            let y = o.this.x; // should narrow to string
        }
    }
}
class Tests12 {
    test1() {}
    test2() {
        for(;;){}
    }
    test3() {
        for(const dummy in []){}
    }
    test4() {
        for (const dummy of []){}
    }
}
