import data from "./data.json" assert { type: "json" };
import "./data2.json" assert { type: "json" };
export { default as data3 } from "./data3.json" assert { type: "json" };
export * as data4 from "./data4.json" assert { type: "json" };

console.log(data);
