({
    showPopup: async function({ mallId: o }) {
        try {
            console.log({
                mallId: o
            });
        } catch (o) {
            console.log(o);
        }
    },
    get liteContractCode () {
        return null;
    }
}).showPopup({
    mallId: 1
});
