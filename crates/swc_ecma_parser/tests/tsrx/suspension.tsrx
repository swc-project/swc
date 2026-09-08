async function AsyncBranch(ready: boolean) @{
    @if (ready) {
        const value = await load();
        <Ready value={value} />
    } @else {
        <Pending />
    }
}

function* GeneratorBranch(ready: boolean) @{
    @if (ready) {
        const value = yield load();
        <Ready value={value} />
    } @else {
        <Pending />
    }
}
