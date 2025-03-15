var named = async function() {
    await bar(1 + 0);
};
var anon = async function() {
    await (1 + 0), bar(2 + 0);
};
