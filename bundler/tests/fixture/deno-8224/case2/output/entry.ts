const showValue = (v)=>{
    if (v === 0) {
        return showList3([
            v
        ]);
    }
    return `${v}`;
};
const showValue1 = showValue;
const showValue2 = showValue1;
const showValue3 = showValue1;
const showList = (v)=>{
    return `[${v.map(showValue3).join(', ')}]`;
};
const showList1 = showList;
const showList2 = showList1;
const showList3 = showList1;
console.log(showList3([
    1,
    2,
    3
]));
console.log(showValue2, showList2);
