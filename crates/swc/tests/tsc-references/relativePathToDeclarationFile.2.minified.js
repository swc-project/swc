//// [test/foo.d.ts]
export { };
//// [test/other.d.ts]
export { };
//// [test/sub/relMod.d.ts]
export { };
//// [test/file1.ts]
foo.M2.x && new relMod(other.M2.x.charCodeAt(0));
export { };
