function e(e) {
    {
        if (e) {
            var l = e._owner;
            var n = describeUnknownElementTypeFrameInDEV(e.type, e._source, l ? l.type : null);
            setExtraStackFrame(n);
        } else {
            setExtraStackFrame(null);
        }
    }
}
