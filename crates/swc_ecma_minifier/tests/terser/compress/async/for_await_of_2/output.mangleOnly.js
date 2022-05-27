async function b(b) {
    for await (a of b){}
    for await (var c of b){}
    for await (let d of b){}
    for await (const e of b){}
}
const c = async (b)=>{
    for await (a of b){}
    for await (var c of b){}
    for await (let d of b){}
    for await (const e of b){}
};
