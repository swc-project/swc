import data from "./data.json" with {
    type: "json"
};
import "./data2.json" with {
    type: "json"
};
export { default as data3 } from "./data3.json" with {
    type: "json"
};
export * as data4 from "./data4.json" with {
    type: "json"
};
console.log(data);
