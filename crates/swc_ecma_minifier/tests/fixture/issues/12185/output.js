import defaultValue, { "with space" as spaced, "" as empty, ordinary } from "data:text/javascript,export default 1;const space=2,empty=3;export{space as \"with space\",empty as \"\"};export const ordinary=4";
console.log(defaultValue, spaced, empty, ordinary);
