var ModalInner = function(param) {
    var data = param.data;
    return React.createElement("div", {
        className: styles.qcWrapper,
        ref: wrapperRef,
        id: "qcDataScroll"
    }, data.qcDataList.map(function(qcData) {
        var _qcData, _qcData_flawImageList, _qcData1, _this;
        return React.createElement("div", {
            className: styles.desc,
            key: qcData.flawDesc
        }, React.createElement("div", {
            className: styles.descTitle
        }, (_qcData = qcData) === null || _qcData === void 0 ? void 0 : _qcData.flawDesc), ((_qcData1 = qcData) === null || _qcData1 === void 0 ? void 0 : (_qcData_flawImageList = _qcData1.flawImageList) === null || _qcData_flawImageList === void 0 ? void 0 : _qcData_flawImageList.length) === 0 ? React.createElement(Empty, null) : React.createElement(Album, {
            data: (_this = qcData?.flawImageList || []) === null || _this === void 0 ? void 0 : _this.map(function(src) {
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
        }, "test"));
    }));
};
