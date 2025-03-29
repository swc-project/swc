(async ()=>2)().catch((x)=>null);
(async function() {
    return 3;
})().catch((x)=>null);
(function*() {
    return 6;
})();
