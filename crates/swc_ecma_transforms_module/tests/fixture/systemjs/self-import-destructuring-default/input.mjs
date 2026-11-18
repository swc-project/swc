import { a } from "./self.mjs";

export const [b, c = a] = [2];

export { b as a };

console.log(a, b, c);
