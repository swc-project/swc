(async () => 2)().catch((x) => null);
(async function () {
    return 3;
})().catch((x) => null);
4;
5;
(function* () {
    return 6;
})();
