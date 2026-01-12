import { A } from "./a";
import { B } from "./b";
import { C } from "./c";
const { A: AB } = B;
const { CB = C } = B;
console.log(A, AB, CB);
