// Input:
function test() {
    if (navigator.userAgentData !== undefined) {
        throw new Error();
    }
}

window.a = [
    function () {
        return test();
    },
];
