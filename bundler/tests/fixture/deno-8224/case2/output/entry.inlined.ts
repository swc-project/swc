const showValue = (v)=>{
    if (v === 0) {
        return showList1([
            v
        ]);
    }
    return `${v}`;
};
const showList = (v)=>{
    return `[${v.map(showValue).join(', ')}]`;
};
const showList1 = showList;
console.log(showList([
    1,
    2,
    3
]));
console.log(showValue, showList);
