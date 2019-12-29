for(;;){
    if (a) {
        if (b) {
            continue;
        }
        c(); // This should not removed and translation should not occur.
    }
}
