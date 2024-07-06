function validateChildKeys(node, parentType) {
    if ("object" == typeof node) {
        if (Array.isArray(node)) for(var i = 0; i < node.length; i++){
            var child = node[i];
            isValidElement(child) && validateExplicitKey(child, parentType);
        }
        else if (isValidElement(node)) // This element was passed in a valid location.
        node._store && (node._store.validated = !0);
        else if (node) {
            var iteratorFn = getIteratorFn(node);
            if ("function" == typeof iteratorFn && iteratorFn !== node.entries) for(var step, iterator = iteratorFn.call(node); !(step = iterator.next()).done;)isValidElement(step.value) && validateExplicitKey(step.value, parentType);
        }
    }
}
