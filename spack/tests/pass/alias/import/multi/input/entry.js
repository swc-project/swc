import { a as foo } from "./a";
import { b as bar } from "./b";

function a() {}
function b() {}

console.log(a(), foo(), b(), bar());
