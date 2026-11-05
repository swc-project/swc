import { models } from "../../projects/api/models.js";

console.log(models);

export { foo } from "./src/foo.js";

export const sum = function(a, b) {
  return a + b;
};
