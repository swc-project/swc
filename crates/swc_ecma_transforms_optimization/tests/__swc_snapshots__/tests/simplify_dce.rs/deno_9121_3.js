function wt(e, n, t, r) {
    var l = e.updateQueue;
    Fe = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
        l.shared.pending = null;
        var s = u, d = s.next;
        s.next = null, o === null ? i = d : o.next = d, o = s;
        var y = e.alternate;
        if (y !== null) {
            y = y.updateQueue;
            var _ = y.lastBaseUpdate;
            _ !== o && (_ === null ? y.firstBaseUpdate = d : _.next = d, y.lastBaseUpdate = s);
        }
    }
    if (i !== null) {
        _ = l.baseState, o = 0, y = d = s = null;
        do {
            u = i.lane;
            var h = i.eventTime;
            if ((r & u) === u) {
                y !== null && (y = y.next = {
                    eventTime: h,
                    lane: 0,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                });
                e: {
                    var k = e, E = i;
                    switch(u = n, h = t, E.tag){
                        case 1:
                            if (k = E.payload, typeof k == 'function') {
                                _ = k.call(h, _, u);
                                break e;
                            }
                            _ = k;
                            break e;
                        case 3:
                            k.flags = k.flags & -4097 | 64;
                        case 0:
                            if (k = E.payload, u = typeof k == 'function' ? k.call(h, _, u) : k, u == null) break e;
                            _ = R({}, _, u);
                            break e;
                        case 2:
                            Fe = !0;
                    }
                }
                i.callback !== null && (e.flags |= 32, u = l.effects, u === null ? l.effects = [
                    i
                ] : u.push(i));
            } else h = {
                eventTime: h,
                lane: u,
                tag: i.tag,
                payload: i.payload,
                callback: i.callback,
                next: null
            }, y === null ? (d = y = h, s = _) : y = y.next = h, o |= u;
            if (i = i.next, i === null) {
                if (u = l.shared.pending, u === null) break;
                i = u.next, u.next = null, l.lastBaseUpdate = u, l.shared.pending = null;
            }
        }while (1)
        y === null && (s = _), l.baseState = s, l.firstBaseUpdate = d, l.lastBaseUpdate = y, gt |= o, e.lanes = o, e.memoizedState = _;
    }
}
wt();
