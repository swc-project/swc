enum E { a }

var x: any;

// invalid left operands
// the left operand is required to be of type Any, the String primitive type, or the Number primitive type
var a1: boolean;
var a2: void;
var a3: {};
var a4: E

var ra1 = a1 in x;
var ra2 = a2 in x;
var ra3 = a3 in x;
var ra4 = a4 in x;
var ra5 = null in x;
var ra6 = undefined in x;
var ra7 = E.a in x;
var ra8 = false in x;
var ra9 = {} in x;

// invalid right operands
// the right operand is required to be of type Any, an object type, or a type parameter type
var b1: number;
var b2: boolean;
var b3: string;
var b4: void;
var b5: string | number;

var rb1 = x in b1;
var rb2 = x in b2;
var rb3 = x in b3;
var rb4 = x in b4;
var rb5 = x in b5;
var rb6 = x in 0;
var rb7 = x in false;
var rb8 = x in '';
var rb9 = x in null;
var rb10 = x in undefined;


// both operands are invalid
var rc1 = {} in '';