// a class constructor may return an expression, it must be assignable to the class instance type to be valid
class C {
    constructor(){
        return 1;
    }
}
class D {
    constructor(){
        return 1; // error
    }
}
class E {
    constructor(){
        return {
            x: 1
        };
    }
}
class F {
    constructor(){
        return {
            x: 1
        }; // error
    }
}
class G {
    constructor(){
        return {
            x: null
        };
    }
}
