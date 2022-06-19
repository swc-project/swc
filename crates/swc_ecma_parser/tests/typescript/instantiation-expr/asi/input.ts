// Parsed as function call, even though this differs from JavaScript
const x1 = f<true>
(true);

// Parsed as relational expressions
const r1 = f < true > true;
const r2 = f < true > +1;
const r3 = f < true > -1;

// All of the following are parsed as instantiation expressions
const x2 = f<true>
true;

const x3 = f<true>;
true;

const x4 = f<true>
if (true) {}

const x5 = f<true>
let yy = 0;

const x6 = f<true>
interface I {}

let x10 = f<true>
this.bar()

let x11 = f<true>
function bar() {}

let x12 = f<true>
class C {}

let x13 = f<true>
bar()

let x14 = f<true>
void bar()

class C1 {
    static specialFoo = f<string>
    static bar = 123
}

class C2 {
    public specialFoo = f<string>
    public bar = 123
}

class C3 {
    private specialFoo = f<string>
    private bar = 123
}

class C4 {
    protected specialFoo = f<string>
    protected bar = 123
}
