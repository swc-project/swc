// Duplicate overloads of construct signatures should generate errors

class C {
    constructor(x        , y        );
    constructor(x        , y        ); // error
    constructor(x        ) { }
}

var r1 = new C(1, '');

class C2    {
    constructor(x   , y        );
    constructor(x   , y        ); // error
    constructor(x   ) { }
}

var r2 = new C2(1, '');

             
                                  
                                           
 

var i   ;
var r3 = new i(1, '');

                 
                                 
                                          
                                    
                                             
 

var i2            ;
var r4 = new i2(1, '');

var a   
                                  
                                           
 

var r5 = new a(1, '');

var b   
                                    
                                             
 

var r6 = new b(1, '');