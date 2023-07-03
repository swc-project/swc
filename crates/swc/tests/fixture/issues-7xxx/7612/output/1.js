var ModalInner = function(param) {
    var data = param.data;
    var _this, _qcData;
    return React.createElement(Album, {
        data: (_this = ((_qcData = qcData) === null || _qcData === void 0 ? void 0 : _qcData.flawImageList) || []) === null || _this === void 0 ? void 0 : _this.map(function(src) {
            var _qcData;
            return {
                url: src,
                describe: (_qcData = qcData) === null || _qcData === void 0 ? void 0 : _qcData.flawDesc
            };
        }),
        showIndicators: true,
        useSafeAreaBottom: true,
        showDescription: true,
        current: current
    }, "test");
};
