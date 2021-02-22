const showList = (v)=>{
    return `[${v.map(showValue1).join(', ')}]`;
};
const showValue1 = (v)=>{
    if (v === 0) {
        return showList([
            v
        ]);
    }
    return `${v}`;
};
console.log(showList([
    1,
    2,
    3
]));
export { showValue1 as showValue };
