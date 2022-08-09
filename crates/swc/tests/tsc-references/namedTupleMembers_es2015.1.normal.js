// @declaration: true
a = b;
a = c;
a = d;
b = a;
b = c;
b = d;
c = a;
c = b;
c = d;
d = a;
d = b;
d = c;
export const func = null;
export function useState(initial) {
    return null;
}
export function readSegment([length, count]) {}
// documenting binding pattern behavior (currently does _not_ generate tuple names)
export const val = null;
q = r;
r = q;
x = y;
y = x;
export const argumentsOfGAsFirstArgument = f(getArgsForInjection(g)); // one tuple with captures arguments as first member
export const argumentsOfG = f(...getArgsForInjection(g)); // captured arguments list re-spread
