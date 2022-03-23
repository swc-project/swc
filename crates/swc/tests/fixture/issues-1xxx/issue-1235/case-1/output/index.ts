class Service {
    async is(a) {
        return a.toUpperCase() === a;
    }
}
(async ()=>{
    await new Service().is('ABC');
})();
