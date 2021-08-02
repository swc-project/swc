function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
        return;
    }

    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
            var child = node[i];

            if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
            }
        }
    } else if (isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
            node._store.validated = true;
        }
    } else if (node) {
        var iteratorFn = getIteratorFn(node);

        if (typeof iteratorFn === 'function') {
            // Entry iterators used to provide implicit keys,
            // but now we print a separate warning for them later.
            if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;

                while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                        validateExplicitKey(step.value, parentType);
                    }
                }
            }
        }
    }
}