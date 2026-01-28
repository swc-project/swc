// Safari 13.1/14.1 has a bug where comma-separated destructuring declarations
// that depend on variables from earlier declarations in the same statement fail.
// This test ensures we emit separate let statements to work around this.
function createSpan(name, _1 = void 0, _2 = void 0) {
    let _ref = [
        _1,
        _2
    ];
    let [_ref1 = {}, ..._rest] = _ref;
    let { startTime = performance.now(), url = typeof window !== 'undefined' ? location.origin + location.pathname : '', scope, device = env.browserName, platform = 'web', enableAutoEnd = true, sendChildImmediately = false, sendImmediately = false, useBeacon } = _ref1;
    let attributes = _object_without_properties(_ref1, [
        "startTime",
        "url",
        "scope",
        "device",
        "platform",
        "enableAutoEnd",
        "sendChildImmediately",
        "sendImmediately",
        "useBeacon"
    ]);
    let [root = true] = _rest;
    console.log(root);
}
