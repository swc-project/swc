import { foo as bar, cat as dog, bird } from "stuff";
console.log(bar, dog, bird);
export { bar as qux, dog, bird };
