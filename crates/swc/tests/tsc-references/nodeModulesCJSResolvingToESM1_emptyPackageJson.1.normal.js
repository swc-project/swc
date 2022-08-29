//// [nodeModulesCJSResolvingToESM1_emptyPackageJson.ts]
//// [/package.json]
{}//// [/module.mts]
export { };
//// [/tsExtension.ts]
import "./module.mjs";
//// [/jsExtension.js]
import "./module.mjs";
//// [/ctsExtension.cts]
import "./module.mjs";
//// [/tsxExtension.tsx]
import "./module.mjs";
