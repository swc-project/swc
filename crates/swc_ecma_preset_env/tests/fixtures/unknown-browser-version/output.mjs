// When the browser version is unknown (Chrome > 999), no transforms or polyfills
// should be added. This matches Babel's behavior.
async function foo({ ...props }) {
    await console.log({
        ...props
    });
}
foo();
