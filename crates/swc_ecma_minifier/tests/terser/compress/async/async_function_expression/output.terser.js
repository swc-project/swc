var named = async function () {
    await bar(1);
};
var anon = async function () {
    await 1, bar(2);
};
