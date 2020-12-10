// ------- BindingPattern = SELF


/* ArrayBindingPattern
* Elision = ,
* BindingRestElement = ... SELF | ... identifier
* BindingElementList = ,? BindingElement | self ,? BindingElement
* BindingElement = identifier = _ | SELF = _
*
* */

// ArrayBindingPattern -> [Elision? BindingRestElement -> BindingIdentifier]
let x = [1, 2, 3, 4, 5, 6]
let [...tail] = x        //  [ 1, 2, 3, 4, 5, 6 ]
let [, ...tail_1] = x //  [ 2, 3, 4, 5, 6 ]
let [,,, ...tail_2] = x //  [ 4, 5, 6 ]

// ArrayBindingPattern -> [Elision? BindingRestElement -> BindingPattern -> ArrayBindingPattern -> [Elision? BindingRestElement -> BindingIdentifier]]
let m1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
let m2 = [[[1, 2, 3, 4],[ 5, 6, 7, 8, 9]]]
let [...[...tail_3]] = m1 // [[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]
let [...[...tail_4]] = m2 // [ [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ] ] ]
let [...[...[...tail_5]]] = m2 // [ [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ] ] ]
let [, ...[,...tail_6]] = m1 // [ [ 7, 8, 9 ] ]
let [, ...[,...tail_7]] = m2 // []
let [, ...[,,...tail_8]] = [1,2,3,[4,5,6,7]] // [ [ 4, 5, 6, 7 ] ]

// ArrayBindingPattern -> [Elision? BindingRestElement -> BindingPattern -> ObjectBindingPattern ... ]

// ArrayBindingPattern -> [BindingElementList -> BindingElisionElement -> BindingElement -> SingleNameBinding]
let [a = 10] = x // 1
let [,ab = 10,,,] = x // 2
let [,,,ba = ab] = x // 4

// ArrayBindingPattern -> [BindingElementList -> BindingElisionElement -> BindingElement -> BindingPattern]
// ArrayBindingPattern -> [BindingElementList,Elision? BindingRestElement]
let [,v1,,...v_rest] = x // 2 [ 4, 5, 6 ]
