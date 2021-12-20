class A {
}
c.valueOf(), c.data.hm, i.valueOf(), i.data.hm;
var c, i, b, a = {
    valueOf: ()=>{
    },
    data: new class extends A {
    }()
};
a.valueOf(), a.data.hm, b.valueOf();
