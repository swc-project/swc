//// [test/foo.d.ts]
export { };
//// [test/other.d.ts]
export { };
//// [test/sub/relMod.d.ts]
export { };
//// [test/file1.ts]
if (foo.M2.x) {
    var x = new relMod(other.M2.x.charCodeAt(0));
}
export { };
