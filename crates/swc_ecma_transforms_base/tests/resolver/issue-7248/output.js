const messages__2 = [
    {
        message: "hello"
    }
];
const logs__2 = messages__2.map(({ log__3 = ()=>console.log(message__3), message__3 })=>log__3);
logs__2[0]();
class A__2 {
    constructor({ log__5 = ()=>console.log(message__5), message__5 }){}
}
