function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    ("undefined" === type || "boolean" === type) && // All of the above are perceived as null.
    (children = null);
    var invokeCallback = !1;
    if (null === children) invokeCallback = !0;
    else switch(type){
        case "string":
        case "number":
            invokeCallback = !0;
            break;
        case "object":
            switch(children.$$typeof){
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                    invokeCallback = !0;
            }
    }
    if (invokeCallback) {
        var _child = children, mappedChild = callback(_child), childKey = "" === nameSoFar ? "." + getElementKey(_child, 0) : nameSoFar;
        if (Array.isArray(mappedChild)) {
            var escapedChildKey = "";
            null != childKey && (escapedChildKey = escapeUserProvidedKey(childKey) + "/"), mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                return c;
            });
        } else null != mappedChild && (isValidElement(mappedChild) && (mappedChild = cloneAndReplaceKey(mappedChild, // traverseAllChildren used to do for objects as children
        escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
        (mappedChild.key && (!_child || _child.key !== mappedChild.key // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
        ) ? escapeUserProvidedKey("" + mappedChild.key) + "/" : "") + childKey)), array.push(mappedChild));
        return 1;
    }
    var subtreeCount = 0, nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + SUBSEPARATOR; // Count of children found in the current subtree.
    if (Array.isArray(children)) for(var i = 0; i < children.length; i++)nextName = nextNamePrefix + getElementKey(child = children[i], i), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
    else {
        var iteratorFn = getIteratorFn(children);
        if ("function" == typeof iteratorFn) {
            var child, nextName, step, iterableChildren = children;
            // Warn about using Maps as children
            iteratorFn === iterableChildren.entries && (didWarnAboutMaps || warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0);
            for(var iterator = iteratorFn.call(iterableChildren), ii = 0; !(step = iterator.next()).done;)nextName = nextNamePrefix + getElementKey(child = step.value, ii++), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        } else if ("object" === type) {
            var childrenString = "" + children;
            throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === childrenString ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
        }
    }
    return subtreeCount;
}
