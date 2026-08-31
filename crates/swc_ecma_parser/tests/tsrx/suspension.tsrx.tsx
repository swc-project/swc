async function AsyncBranch(ready: boolean) {
    return ready ? await (async ()=>{
        const value = await load();
        return <Ready value={value}/>;
    })() : <Pending/>;
}
function* GeneratorBranch(ready: boolean) {
    return ready ? yield* function*() {
        const value = yield load();
        return <Ready value={value}/>;
    }() : <Pending/>;
}
