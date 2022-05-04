// We keep the .js extension for ESModules, but SWC will strip it:
import { modulo } from "./modules/modulo.js";
import { sum } from "./sum.js";
console.log(modulo(sum(1, 2), 2));
