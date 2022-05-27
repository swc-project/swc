function a(a) {
    {
        if (a) {
            var b = a._owner;
            var c = describeUnknownElementTypeFrameInDEV(a.type, a._source, b ? b.type : null);
            setExtraStackFrame(c);
        } else {
            setExtraStackFrame(null);
        }
    }
}
