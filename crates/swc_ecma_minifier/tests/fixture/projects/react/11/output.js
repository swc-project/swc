function setCurrentlyValidatingElement$1(element) {
    if (element) {
        var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
        setExtraStackFrame(stack);
    } else setExtraStackFrame(null);
}
