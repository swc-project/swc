const categories__2 = [
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
const item__2 = "some item";
const catNames__2 = categories__2.reduce((a__3, item__3)=>{
    return {
        ...a__3,
        [item__3.key.toString()]: item__3
    };
}, {});
