
export function createTypeChecker(host) {

    return {
        getFlowTypeOfReference
    }

    function getFlowTypeOfReference(reference, declaredType, initialType = declaredType, flowContainer, flowNode = (_a2 => (_a2 = tryCast(reference, canHaveFlowNode)) == null ? void 0 : _a2.flowNode)()) {


    }
}