declare module "*.txt" with {
    type: "text"
} {
    const content: string;
    export default content;
}
declare module "*.json" with {
    type: "json"
};
declare module "*.bin" with {
    type: "bytes",
    "x-extra": "1"
} {
}
