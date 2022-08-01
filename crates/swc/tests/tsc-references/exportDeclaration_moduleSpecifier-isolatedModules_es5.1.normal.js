// @isolatedModules: true
// @Filename: /a.ts
export { };
// @Filename: /b.ts
export { }; // should not error, but would without `type`
