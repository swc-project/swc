class A {
}
c.valueOf(), c.data.hm, c.hm, i.valueOf(), i.data.hm, i.hm;
var c, i, b, a = {
    valueOf: ()=>{},
    data: new class extends A {
    }()
};
a.valueOf(), a.data.hm, i.hm, b.valueOf();
