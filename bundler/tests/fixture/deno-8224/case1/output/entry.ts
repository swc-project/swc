const showValue1 = (v)=>{
    if (v === 0) {
        return showList2([
            v
        ]);
    }
    return `${v}`;
};
export { showValue1 as showValue };
const showValue2 = showValue1;
const showValue3 = showValue2;
const showList = (v)=>{
    return `[${v.map(showValue3).join(', ')}]`;
};
const showList1 = showList;
const showList2 = showList1;
console.log(showList2([
    1,
    2,
    3
]));
