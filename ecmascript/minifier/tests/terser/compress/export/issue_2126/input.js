import { foo as bar, cat as dog } from "stuff";
console.log(bar, dog);
export { bar as qux };
export { dog };
