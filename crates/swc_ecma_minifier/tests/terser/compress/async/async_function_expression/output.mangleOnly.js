var a = async function a() {
    (await bar(1 + 0)) + (2 + 0);
};
var n = async function() {
    (await (1 + 0)) + bar(2 + 0);
};
