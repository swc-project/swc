// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
export { };
// @Filename: b.ts
class B {
}
export { };
// @Filename: c.ts
export { };
// @Filename: c.fixed.ts
export { };
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
// @Filename: d.fixed.ts
export { };
// @Filename: e.ts
export { };
// @Filename: e.fixed.ts
export { };
// @Filename: f.ts
export { };
// @Filename: f.fixed.ts
export { };
