// A constructor of a nested class can use the private names of the outer
// class. Moving it out of the outer class would leave `#p` undeclared.
class C {
    #p;
    static set(x) {
        C.value = x;
    }
    static cache = new class {
        constructor(obj){
            console.log(#p in obj);
        }
    }({});
}
class D {
    #q;
    static set(x) {
        D.value = x;
    }
    static cache = new class {
        constructor(has = (obj)=>#q in obj){
            console.log(has({}));
        }
    }();
}
