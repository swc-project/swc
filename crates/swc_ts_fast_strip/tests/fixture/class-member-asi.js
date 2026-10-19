         class AbstractASI {
    f = 1/*missing ; */
    ;                      
    ["computed-method"]() {}
}

         class AbstractASI2 {
    f = 1
    ;                       
    ["computed-method"]() {}
}

class OverloadASI {
    f = 1
             
    m() {}
    g = 2
    ;         
    *gen() {}
}

         class PropASI {
    f = 1
    ;                
    [Symbol.iterator]() {}
    g = 2
    ;                 
    in() {}
}

class NoExtraSemi {
    f = 1;
             
    ["a"]() {}
}
