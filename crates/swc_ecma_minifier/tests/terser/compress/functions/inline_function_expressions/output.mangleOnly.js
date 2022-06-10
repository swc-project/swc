(async ()=>2)().catch((a)=>null);
(async function() {
    return 3;
})().catch((a)=>null);
(()=>4)();
(function() {
    return 5;
})();
(function*() {
    return 6;
})();
