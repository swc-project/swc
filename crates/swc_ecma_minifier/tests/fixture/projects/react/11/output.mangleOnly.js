function e(e) {
    {
        if (e) {
            var n = e._owner;
            var r = describeUnknownElementTypeFrameInDEV(e.type, e._source, n ? n.type : null);
            setExtraStackFrame(r);
        } else {
            setExtraStackFrame(null);
        }
    }
}
