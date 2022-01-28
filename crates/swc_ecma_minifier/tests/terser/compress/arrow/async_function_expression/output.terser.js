var named = async function foo() {
    await bar(1);
};
var anon = async () => {
    await 1, bar(2);
};
