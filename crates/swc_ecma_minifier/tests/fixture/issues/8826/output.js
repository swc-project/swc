export function createTypeChecker(host) {
    return {
        getFlowTypeOfReference: function(reference, declaredType, initialType = declaredType, flowContainer, flowNode = ((_a2)=>null == (_a2 = tryCast(reference, canHaveFlowNode)) ? void 0 : _a2.flowNode)()) {}
    };
}
