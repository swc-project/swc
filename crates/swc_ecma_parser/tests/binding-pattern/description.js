// self - local self

// ArrayBindingPattern -> [Elision? BindingRestElement -> BindingIdentifier]

/*
* ArrayBindingPattern
* Elision = ,
* BindingRestElement = ... SELF | ... identifier
* BindingElementList = ,? BindingElement | self ,? BindingElement
* BindingElement = identifier = _ | SELF = _
*
* */
let simple_array = [1, 2, 3, 4, 5, 6]
let multi_array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
let multi_array_2 = [[[1, 2, 3, 4], [5, 6, 7, 8, 9]]]
let obj = {
    num: 10,
    null: null,
    nested: {nested: {val: "val"}, array: simple_array},
    s_array: simple_array,
    m_array: multi_array
}
// ------- BindingPattern = SELF
{
    let [...tail] = simple_array        //  [ 1, 2, 3, 4, 5, 6 ]
    let [, ...tail_1] = simple_array //  [ 2, 3, 4, 5, 6 ]
    let [, , , ...tail_2] = simple_array //  [ 4, 5, 6 ]

// ArrayBindingPattern -> [Elision? BindingRestElement -> BindingPattern -> ArrayBindingPattern -> [Elision? BindingRestElement -> BindingIdentifier]]
    let [...[...tail_3]] = multi_array // [[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]
    let [...[...tail_4]] = multi_array_2 // [ [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ] ] ]
    let [...[...[...tail_5]]] = multi_array_2 // [ [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ] ] ]
    let [, ...[, ...tail_6]] = multi_array // [ [ 7, 8, 9 ] ]
    let [, ...[, ...tail_7]] = multi_array_2 // []
    let [, ...[, , ...tail_8]] = [1, 2, 3, [4, 5, 6, 7]] // [ [ 4, 5, 6, 7 ] ]

// ArrayBindingPattern -> [Elision? BindingRestElement -> BindingPattern -> ObjectBindingPattern ... ]

// ArrayBindingPattern -> [BindingElementList -> BindingElisionElement -> BindingElement -> SingleNameBinding]
    let [a = 10] = simple_array // 1
    let [, ab = 10, , ,] = simple_array // 2
    let [, , , ba = ab] = simple_array // 4

// ArrayBindingPattern -> [BindingElementList -> BindingElisionElement -> BindingElement -> BindingPattern]
// ArrayBindingPattern -> [BindingElementList,Elision? BindingRestElement]
    let [, v1, , ...v_rest] = simple_array // 2 [ 4, 5, 6 ]

    /*
    * ObjectBindingPattern
    * {}
    * {BindingRestProperty} = ... id
    * {BindingPropertyList} = BindingProperty | self,BindingProperty
    * {BindingPropertyList,BindingRestProperty }
    *  BindingProperty = id = _ | PropertyName : id = _ | PropertyName : SELF = _
    *  PropertyName = ((UnicodeIDStart | $ | _ ) (UnicodeIDContinue | $ | <ZWNJ> <ZWJ> ) | "string" | 'string' | num | [ _ ]
    * */
// ObjectBindingPattern -> {}
    let {} = obj // {}
// ObjectBindingPattern -> {BindingRestProperty}
    let {...obj2} = obj // obj
    var {...obj3} = obj // obj

// ObjectBindingPattern -> {BindingPropertyList}
    let {simple_prop = 10} = obj // 10
    let {obj_prop = {value: prop2 = 10}, prop3 = [1]} = obj // obj_prop = {value:10},prop2 = 10
    let {obj1 = {$: num = 10, '': sym = '', " ": quote = " ", _: under = [...tail],}} = obj // obj_prop = {value:10},prop2 = 10
}
// ----------------- //

// Spots
// PrimaryExpression -> (...SELF) | (Expression, ...SELF)
// LexicalDeclaration[ -> (let | const) SELF
// Iteration Statements -> for((var | let | const) SELF (in | of) ...)
// TryStatement -> try{...} catch(SELF){...}
class MyError extends Error {
    constructor(name1, name2) {
        super();
        this.name1 = name1;
        this.name2 = name2;
    }
}

try {
    let err = new MyError("name1", "name2")
    err.code = "code"
    throw err
} catch ({name1, name2, code, ...rest}) {
    console.log(name1, name2, code, rest)
}

for (let [, , t] = simple_array; t < 10; t++) {
    // console.log(t)
}
for (let {num} = obj; num < 11; num++) {
    // console.log(num)
}