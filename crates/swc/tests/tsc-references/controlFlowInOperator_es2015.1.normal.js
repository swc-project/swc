const a = 'a';
const b = 'b';
const d = 'd';
if ('a' in c) {
    c; // A
    c['a']; // number;
}
if ('d' in c) {
    c; // never
}
if (a in c) {
    c; // A
    c[a]; // number;
}
if (d in c) {
    c; // never
}
