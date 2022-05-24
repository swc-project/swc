// call signatures in derived types must have the same or fewer optional parameters as the target for assignment
var ClassTypeParam;
(function(ClassTypeParam) {
    class Base {
        constructor(){
            this.init = ()=>{
                this.a = ()=>null; // ok, same T of required params
                this.a = (x)=>null; // ok, same T of required params
                this.a = (x)=>null; // error, too many required params
                this.a2 = ()=>null; // ok, same T of required params
                this.a2 = (x)=>null; // ok, same T of required params
                this.a2 = (x)=>null; // ok, same number of params
                this.a3 = ()=>null; // ok, fewer required params
                this.a3 = (x)=>null; // ok, fewer required params
                this.a3 = (x)=>null; // ok, same T of required params
                this.a3 = (x, y)=>null; // error, too many required params
                this.a4 = ()=>null; // ok, fewer required params
                this.a4 = (x, y)=>null; // ok, fewer required params
                this.a4 = (x)=>null; // ok, same T of required params
                this.a4 = (x, y)=>null; // ok, same number of params
                this.a5 = ()=>null; // ok, fewer required params
                this.a5 = (x, y)=>null; // ok, fewer required params
                this.a5 = (x)=>null; // ok, all present params match
                this.a5 = (x, y)=>null; // ok, same number of params
            };
        }
    }
})(ClassTypeParam || (ClassTypeParam = {}));
var GenericSignaturesInvalid;
(function(GenericSignaturesInvalid) {
    class Base2 {
    }
    class Target {
    }
    function foo() {
        var b;
        var t;
        // all errors
        b.a = t.a;
        b.a = t.a2;
        b.a = t.a3;
        b.a = t.a4;
        b.a = t.a5;
        b.a2 = t.a;
        b.a2 = t.a2;
        b.a2 = t.a3;
        b.a2 = t.a4;
        b.a2 = t.a5;
        b.a3 = t.a;
        b.a3 = t.a2;
        b.a3 = t.a3;
        b.a3 = t.a4;
        b.a3 = t.a5;
        b.a4 = t.a;
        b.a4 = t.a2;
        b.a4 = t.a3;
        b.a4 = t.a4;
        b.a4 = t.a5;
        b.a5 = t.a;
        b.a5 = t.a2;
        b.a5 = t.a3;
        b.a5 = t.a4;
        b.a5 = t.a5;
    }
})(GenericSignaturesInvalid || (GenericSignaturesInvalid = {}));
var GenericSignaturesValid;
(function(GenericSignaturesValid) {
    class Base2 {
        constructor(){
            this.init = ()=>{
                this.a = ()=>null; // ok, same T of required params
                this.a = (x)=>null; // ok, same T of required params
                this.a = (x)=>null; // error, too many required params
                this.a2 = ()=>null; // ok, same T of required params
                this.a2 = (x)=>null; // ok, same T of required params
                this.a2 = (x)=>null; // ok, same number of params
                this.a3 = ()=>null; // ok, fewer required params
                this.a3 = (x)=>null; // ok, fewer required params
                this.a3 = (x)=>null; // ok, same T of required params
                this.a3 = (x, y)=>null; // error, too many required params
                this.a4 = ()=>null; // ok, fewer required params
                this.a4 = (x, y)=>null; // ok, fewer required params
                this.a4 = (x)=>null; // ok, same T of required params
                this.a4 = (x, y)=>null; // ok, same number of params
                this.a5 = ()=>null; // ok, fewer required params
                this.a5 = (x, y)=>null; // ok, fewer required params
                this.a5 = (x)=>null; // ok, all present params match
                this.a5 = (x, y)=>null; // ok, same number of params
            };
        }
    }
})(GenericSignaturesValid || (GenericSignaturesValid = {}));
