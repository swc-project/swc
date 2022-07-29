// @traceResolution: true
// @Filename: /src/a.ts
export default 0; // No extension: '.ts' added
// @Filename: /src/b.ts
export { }; // '.js' extension: stripped and replaced with '.ts'
// @Filename: /src/d.ts
export { };
// @Filename: /src/jquery.d.ts
export default x; // No extension: '.d.ts' added
// @Filename: /src/jquery_user_1.ts
export { }; // '.js' extension: stripped and replaced with '.d.ts'
// @Filename: /src/jquery_user_1.ts
export { };
