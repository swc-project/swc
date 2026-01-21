(function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
    let _liteContractCode = null;

    async function showPopup({ mallId }) {
        try {
            console.log({
                mallId: mallId,
            });
        } catch (e) {
            console.log(e);
        }
    }

    const liteContractHelper = {
        showPopup,
        get liteContractCode () {
            return _liteContractCode;
        }
    };

    liteContractHelper.showPopup({ mallId: 1 });
})();
