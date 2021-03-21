const showValue1 = (v)=>{
    if (v === 0) {
        return showList([
            v
        ]);
    }
    return `${v}`;
};
const showList = (v)=>{
    return `[${v.map(showValue1).join(', ')}]`;
};
console.log(showList([
    1,
    2,
    3
]));
export { showValue1 as showValue };
