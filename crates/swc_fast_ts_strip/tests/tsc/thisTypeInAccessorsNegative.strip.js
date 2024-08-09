// @noImplicitAny: true
// @noImplicitThis: true
// @target: es5
               
              
              
 
               
                                                     
 
const mismatch = {
    n: 13,
    get x(this: Foo) { return this.n; },
    set x(this     , n) { this.wrong = "method"; }
}
const contextual      = {
    n: 16,
    get x() { return this.n; }
}
