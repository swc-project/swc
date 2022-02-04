var i, a;
class C {
    constructor(x){
        return x;
    }
}
new C("a"), a = i = a, new C("hi"), new i("bye"), new a("hm");
