// Test case for issue #11142: TypeScript expressions in destructuring assignment

// ============================================
// Expr::TsNonNull - Non-null assertion: expr!
// ============================================

// Original issue case: array element swapping with non-null assertions
let arrayCopy = [1, 2, 3];
let currentIndex = 0;
let randomIndex = 1;
[arrayCopy[currentIndex] , arrayCopy[randomIndex] ] = [
    arrayCopy[randomIndex] ,
    arrayCopy[currentIndex] ,
];

// Simple non-null assertion in array destructuring
let a                = 1;
let b                = 2;
[a , b ] = [b , a ];

// Non-null assertion with member expressions
let obj                             = { x: 1, y: 2 };
[obj.x , obj.y ] = [obj.y , obj.x ];

// Non-null assertion in object destructuring
({ x: obj.x  } = { x: 5 });

// Complex nested case
let arr                      = [[1, 2], [3, 4]];
[arr[0] [0] , arr[1] [1] ] = [arr[1] [1] , arr[0] [0] ];


// ============================================
// Expr::TsInstantiation - Type instantiation: expr<Type>
// ============================================

// Type instantiation in destructuring (generic function reference)
                                      
let fn1                ;
let fn2                ;
[fn1, fn2] = [identity        , identity        ];

// ============================================
// Expr::TsSatisfies - Satisfies expression: expr satisfies Type
// ============================================

// Satisfies in array destructuring
let s1          = "hello";
let s2          = "world";
[s1                 , s2                 ] = [s2                 , s1                 ];

// Satisfies with member expression
let config                        = { setting: "value" };
[config.setting                 ] = ["new value"                 ];

// Satisfies in object destructuring
({ key: config.setting                  } = { key: "updated" });

