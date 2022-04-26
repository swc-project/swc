const categories__1 = [
    {
        key: "apple"
    },
    {
        key: "banana"
    },
    {
        key: "strawberry"
    }
];
const item__1 = "some item";
const catNames__1 = categories__1.reduce((a__2, item__2)=>{
    return {
        ...a__2,
        [item__2.key.toString()]: item__2
    };
}, {});
