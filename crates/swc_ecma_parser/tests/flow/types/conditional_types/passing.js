let x: number extends string ? boolean : null;
let x: string | number extends string ? boolean : null;

let x: | number extends | number ? | number : | number;
let x: string | number extends string | number ? string | number : string | number;

let x: number extends string ? number extends string ? 1 : 2 : number extends string ? 1 : 2;
let x: (number extends string ? 1 : 2) extends (number extends string ? 1 : 2) ? boolean : null;

let x :
  (// comment 1
    (/* comment 2 */ number) extends string ? boolean : (null) /* trailing */)

type ArrayElement<T> = T extends Array<infer E> ? E : empty;

let x : number extends infer T extends number ? string : number;

let x : infer T extends number ? string : number;

let x : number extends (infer T extends number ? string : number) ? string : number;

let x : /* comment 3 */ infer /* comment 4 */ T /* comment 5 */ extends /* comment 6 */ number;

let x: infer A extends (infer B extends infer C ? infer D : infer E) ? string : number;
