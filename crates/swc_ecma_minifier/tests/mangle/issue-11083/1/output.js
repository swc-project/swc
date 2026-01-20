(function(o, l, n) {
    let t = null;
    async function c({ mallId: o }) {
        try {
            console.log({
                mallId: o
            });
        } catch (o) {
            console.log(o);
        }
    }
    const e = {
        showPopup: c,
        get liteContractCode () {
            return t;
        }
    };
    e.showPopup({
        mallId: 1
    });
})();
