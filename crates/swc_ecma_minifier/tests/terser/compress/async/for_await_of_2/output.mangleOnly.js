async function a(a) {
    for await (a of a){}
    for await (var o of a){}
    for await (let o of a){}
    for await (const o of a){}
}
const o = async (a)=>{
    for await (a of a){}
    for await (var o of a){}
    for await (let o of a){}
    for await (const o of a){}
};
