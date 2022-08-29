//// [moduleResolutionWithExtensions.ts]
//// [/src/a.ts]
export default 0; // No extension: '.ts' added
//// [/src/b.ts]
export { }; // '.js' extension: stripped and replaced with '.ts'
//// [/src/d.ts]
export { };
//// [/src/jquery.d.ts]
export default x; // No extension: '.d.ts' added
//// [/src/jquery_user_1.ts]
export { }; // '.js' extension: stripped and replaced with '.d.ts'
//// [/src/jquery_user_1.ts]
export { };
