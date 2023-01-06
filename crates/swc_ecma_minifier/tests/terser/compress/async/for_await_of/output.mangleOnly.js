async function o(o) {
    for await (a of o){}
    for await (var f of o){}
    for await (let f of o){}
    for await (const f of o){}
}
