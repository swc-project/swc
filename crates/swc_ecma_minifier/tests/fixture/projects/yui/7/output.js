export const E = {
    _sort: function() {
        // keep going until we make a pass without moving anything
        for(// create an indexed list
        var l, a, b, j, k, moved, doneKey, s = YObject.keys(this.required), // loaded = this.loaded,
        //TODO Move this out of scope
        done = {}, p = 0;;){
            // start the loop after items that are already sorted
            for(l = s.length, moved = !1, j = p; j < l; j++){
                // check everything below current item and move if we
                // find a requirement for the current item
                for(// check the next module on the list to see if its
                // dependencies have been met
                a = s[j], k = j + 1; k < l; k++)if (!done[doneKey = a + s[k]] && this._requires(a, s[k])) {
                    // extract the dependency so we can move it up
                    b = s.splice(k, 1), // insert the dependency above the item that
                    // requires it
                    s.splice(j, 0, b[0]), // only swap two dependencies once to short circut
                    // circular dependencies
                    done[doneKey] = !0, // keep working
                    moved = !0;
                    break;
                }
                // jump out of loop if we moved something
                if (moved) break;
                p++;
            }
            // when we make it here and moved is false, we are
            // finished sorting
            if (!moved) break;
        }
        this.sorted = s;
    }
};
