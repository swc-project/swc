for(; list && firingIndex < firingLength; firingIndex++){
    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
        memory = false;
        break;
    }
}
