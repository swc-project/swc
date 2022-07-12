// @strict: true
let g = f || ((abc)=>{
    void abc.toLowerCase();
});
let gg = f !== null && f !== void 0 ? f : (abc)=>{
    void abc.toLowerCase();
};
