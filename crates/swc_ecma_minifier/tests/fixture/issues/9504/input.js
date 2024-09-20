export function panUpdate(e) {
    if (!moveDirectionExpected) {
        panStart = false;
        return;
    }
    caf(rafIndex);
    if (panStart) { rafIndex = raf(function () { panUpdate(e); }); }

    if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
    if (moveDirectionExpected) {
        if (!preventScroll && isTouchEvent(e)) { preventScroll = true; }

        try {
            if (e.type) { events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e)); }
        } catch (err) { }

        var x = translateInit,
            dist = getDist(lastPosition, initPosition);
        if (!horizontal || fixedWidth || autoWidth) {
            // Relevant lines below
            x += dist;
            x += 'px';
        } else {
            var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : dist * 100 / (viewport + gutter);
            x += percentageX;
            x += '%';
        }

        container.style[transformAttr] = transformPrefix + x + transformPostfix;
    }
}