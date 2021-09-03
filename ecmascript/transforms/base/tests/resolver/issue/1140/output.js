const categories = [
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
const item = "some item";
const catNames = categories.reduce((a__2, item__2)=>{
    return {
        ...a__2,
        [item__2.key.toString()]: item__2
    };
}, {
});
