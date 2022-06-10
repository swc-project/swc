ab.kind; // Error
let a = x;
// Repro from #31663
const x1 = {
    a: 'foo',
    b: 42
};
const x2 = {
    a: 'foo',
    b: true
};
x1[k] = 'bar'; // Error
x2[k] = 'bar'; // Error
var Tag1;
(function(Tag1) {})(Tag1 || (Tag1 = {}));
var Tag2;
(function(Tag2) {})(Tag2 || (Tag2 = {}));
s1 = s2;
s2 = s1;
t1 = t2;
t2 = t1;
// Repro from #36736
const f1 = (t)=>t;
const f2 = (t)=>t;
const f3 = (t)=>t;
const f4 = (t)=>t;
