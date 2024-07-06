let x /**/        /**/ = 1 ;
//        ^^^^^^^^        ^

[]                   ;
// ^^^^^^^^^^^^^^^^^^

(        "test");
//^^^^^^^^

class C /**/   /*︎*/ extends Array/**/    /*︎*/                /*︎*/ {
    //          ^^^^^                      ^^^     ^^^^^^^^^^^^^^
             field/**/        /**/ = "";
    //  ^^^^^^^^          ^^^^^^^^
    static accessor f1;
            f2/**/ /**/        /*︎*/;
    //  ^^^^^^^       ^    ^^^^^^^^
                    
    //  ^^^^^^^^^^^^^^^^ declared property

           method/**/   /*︎*/(/*︎*/        /**/ a  /*︎*/        /**/)/*︎*/      /*︎*/ {
        //  ^^^^^^           ^^^         ^^^^^^^^      ^     ^^^^^^^^         ^^^^^^
    }

                       
    //  ^^^^^^^^^^^^^^^^^^^ index signature

    get g()      { return 1 };
    //         ^^^^^
    set g(v     ) { };
    //         ^^^^^
}

class D extends C      {
    //               ^^^^^
             method(...args)      { }
    //  ^^^^^^^^                ^^^^^
}

         class A {
    // ^^^^^^^^
               
    //  ^^^^^^^^^^^ abstract property
    b;
                      
    //  ^^^^^^^^^^^^^^^^^^ abstract method
}

{
    let m = new (Map )                ([] );
    //              ^ ^^^^^^^^^^^^^^^^   ^
}

{
    let a = (foo )     ;
    //          ^ ^^^^^
}

{
    let a = (foo )     ([] );
    //          ^ ^^^^^   ^
}

{
    let f = function (p     ) { }
    //                ^^^^^
}

{
                                
    //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ overload
    function overload()      { }
    //                     ^^^^^
}

/** @doc */
               
// ^^^^^^^^^^^ interface

void 0;

/** @doc */
           
// ^^^^^^^^ type alias

/**/                                 
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `import type`

/**/                  
//  ^^^^^^^^^^^^^^^^^^ `export type`

/**/                                 
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `export type *`

import {                           deepEqual } from "node:assert";
//      ^^^^^^^^^^^^^^^^^^^^^^^^^

export {
    C,
           
    //  ^^^^^^
}

/**/                   
//  ^^^^^^^^^^^^^^^^^^^

function foo   (p      = ()      => 1)      {
    //          ^^^  ^^^^^     ^^^^^      ^^^^^
    return p       ;
    //           ^^^^^^
}

/**/                   
//  ^^^^^^^^^^^^^^^^^^ `declare enum`

void 0;

/**/                       
//  ^^^^^^^^^^^^^^^^^^^^^^ `declare namespace`

void 0;

/**/                    
//  ^^^^^^^^^^^^^^^^^^^ `declare module`

void 0;

/**/              
//  ^^^^^^^^^^^^^^ `declare let`

void 0;

/**/                               
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `declare class`

void 0;

/**/                                          
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `declare function`

void 0;

// `=>` spanning line cases:
{
    ( 
            ) =>
        1
};
{
    (  
          ) =>
        1
};
{
    (
     
            ) =>
        1
};
{
    (
        
                 
        ) =>
        1
};
{
    (
      
                       
        ) =>
        1
};
{
    (a, b, c    = []       /*comment-1*/ /*comment-2*/ 
          ) =>
        1
};


    (  
          )=>
        1;
