//// [exportDeclaration_moduleSpecifier-isolatedModules.ts]
//// [/a.ts]
export { };
//// [/b.ts]
export { }; // should not error, but would without `type`
