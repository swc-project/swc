const showValue1 = (v)=>{
    if (v === 0) {
        return showList1([
            v
        ]);
    }
    return `${v}`;
};
export { showValue1 as showValue };
const showList = (v)=>{
    return `[${v.map(showValue1).join(', ')}]`;
};
const showList1 = showList;
console.log(showList([
    1,
    2,
    3
]));
