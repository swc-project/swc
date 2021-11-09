const showValue = (v)=>{
    if (v === 0) {
        return showList([
            v
        ]);
    }
    return `${v}`;
};
const showList = (v)=>{
    return `[${v.map(showValue).join(', ')}]`;
};
console.log(showList([
    1,
    2,
    3
]));
console.log(showValue, showList);
