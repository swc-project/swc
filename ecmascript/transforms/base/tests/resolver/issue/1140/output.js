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
const catNames = categories.reduce((a, item1)=>{
    return {
        ...a,
        [item1.key.toString()]: item1
    };
}, {
});
