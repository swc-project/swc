export function panUpdate(e) {
    if (!moveDirectionExpected) {
        panStart = !1;
        return;
    }
    if (caf(rafIndex), panStart && (rafIndex = raf(function() {
        panUpdate(e);
    })), '?' === moveDirectionExpected && (moveDirectionExpected = getMoveDirectionExpected()), moveDirectionExpected) {
        !preventScroll && isTouchEvent(e) && (preventScroll = !0);
        try {
            e.type && events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e));
        } catch (err) {}
        var x = translateInit, dist = getDist(lastPosition, initPosition);
        !horizontal || fixedWidth || autoWidth ? (// Relevant lines below
        x += dist, x += 'px') : (x += TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : 100 * dist / (viewport + gutter), x += '%'), container.style[transformAttr] = transformPrefix + x + transformPostfix;
    }
}
