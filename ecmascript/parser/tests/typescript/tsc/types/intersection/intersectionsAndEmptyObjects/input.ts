// @target: es2015

// Empty object type literals are removed from intersections types
// that contain other object types

type A = { a: number };
type B = { b: string };
type C = {};

let x01: A & B;
let x02: A & C;
let x03: B & C;
let x04: A & B & C;
let x05: string & C;
let x06: C & string;
let x07: C;
let x08: C & {};
let x09: {} & A & {} & B & {} & C & {};

interface D {}
interface E {}

let x10: A & D;
let x11: C & D;
let x12: A & B & C & D;
let x13: D & E;
let x14: A & B & C & D & E;

// Repro from #20225

type Dictionary = { [name: string]: string };

const intersectDictionaries = <F1 extends Dictionary, F2 extends Dictionary>(
  d1: F1,
  d2: F2,
): F1 & F2 => Object.assign({}, d1, d2);

const testDictionary = <T extends Dictionary>(_value: T) => { };

const d1 = {};
testDictionary(d1);
const d2 = intersectDictionaries(d1, d1);
testDictionary(d2);

const d3 = {
  s: '',
};
testDictionary(d3);
const d4 = intersectDictionaries(d1, d3);
testDictionary(d4);
const d5 = intersectDictionaries(d3, d1);
testDictionary(d5);
const d6 = intersectDictionaries(d3, d3);
testDictionary(d6);

// Repro from #27044

type choices<IChoiceList extends {
    [key: string]: boolean;
}> = IChoiceList & {
    shoes:boolean;
    food:boolean;
};

type IMyChoiceList = {
    car: true
};

type IUnknownChoiceList = {};

var defaultChoices: choices<{}>;
var defaultChoicesAndEmpty: choices<{} & {}>;

var myChoices: choices<IMyChoiceList>;
var myChoicesAndEmpty: choices<IMyChoiceList & {}>;

var unknownChoices: choices<IUnknownChoiceList>;
var unknownChoicesAndEmpty: choices<IUnknownChoiceList & {}>;

// Repro from #38672

type Foo1 = { x: string } & { [x: number]: Foo1 };
type Foo2 = { x: string } & { [K in number]: Foo2 };
