         class AbstractASI {
    f = 1/*missing ; */
    ;                      
//  ;^^^^^^^^^^^^^^^^^^^^^^
    ["computed-method"]() {}
}

class Declare {
    f = 1
    ;                
    *gen() {}
}

class Overload {
    f = 1
             
    ;                  
    in() {}
}

class Signature {
    f = 1
    ;                
    ;                     
    ["computed"]() {}
}

class Ctor {
    f = 1
                 
    constructor(a         ) {}
    instanceof() {}
}
