class C1 {
    f(x) {
        return undefined;
    }
}
class C2 {
}
class C3 {
}
class C5 {
    foo() {
        let f1 = (x)=>this;
        let f2 = (x)=>this;
        let f3 = (x)=>(y)=>this;
        let f4 = (x)=>{
            let g = (y)=>{
                return ()=>this;
            };
            return g(this);
        };
    }
    bar() {
        let x1 = undefined;
        let x2 = undefined;
    }
}
