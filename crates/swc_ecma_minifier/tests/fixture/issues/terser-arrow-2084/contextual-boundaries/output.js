async function nestedArrowBody() {
    return (value = ()=>{
        var await = 1;
        return await;
    })=>value;
}
class StaticComputedKey {
    static [(await)=>await] = console.log(1);
}
console.log(typeof nestedArrowBody);
console.log(StaticComputedKey.name);
