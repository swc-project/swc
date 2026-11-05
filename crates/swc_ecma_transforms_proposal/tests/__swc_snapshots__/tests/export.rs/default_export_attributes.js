export { default as value } from "first";
export { default as other } from "second";
export * as namespace from "second" with {
    type: "json"
};
