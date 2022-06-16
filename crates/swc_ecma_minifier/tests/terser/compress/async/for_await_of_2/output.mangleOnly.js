async function a(a) {
    for await (a of a){}
    for await (var b of a){}
    for await (let c of a){}
    for await (const d of a){}
}
const b = async (a)=>{
    for await (a of a){}
    for await (var b of a){}
    for await (let c of a){}
    for await (const d of a){}
};
