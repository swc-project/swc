for(; list && firingIndex < firingLength; firingIndex++)if (!1 === list[firingIndex].apply(data[0], data[1]) && options.stopOnFalse) {
    memory = !1;
    break;
}
