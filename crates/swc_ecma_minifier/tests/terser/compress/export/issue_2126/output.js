import { foo as o } from "stuff";
import { cat as f } from "stuff";
"module evaluation";
import "stuff";
import { foo as o } from "stuff";
import { cat as f } from "stuff";
console.log(o, f);
export { o as qux, f as dog };
