function setCurrentlyValidatingElement$1(element) {
    if (element) {
        var owner = element._owner;
        setExtraStackFrame(describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null));
    } else setExtraStackFrame(null);
}
