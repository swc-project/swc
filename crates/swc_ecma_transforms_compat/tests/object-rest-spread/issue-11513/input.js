// Safari 13.1/14.1 has a bug where comma-separated destructuring declarations
// that depend on variables from earlier declarations in the same statement fail.
// This test ensures we emit separate let statements to work around this.

function createSpan(
    name,
    {
        startTime = performance.now(),
        url = typeof window !== 'undefined'
            ? location.origin + location.pathname
            : '',
        scope,
        device = env.browserName,
        platform = 'web',
        enableAutoEnd = true,
        sendChildImmediately = false,
        sendImmediately = false,
        useBeacon,
        ...attributes
    } = {},
    root = true,
) {
    console.log(root);
}
