(async () => 2)().catch((n) => null);
(async function () {
    return 3;
})().catch((n) => null);
(() => 4)();
(function () {
    return 5;
})();
(function* () {
    return 6;
})();
