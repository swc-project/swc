for(;;){
    if (a) {
        continue;
    }
    b(); // This should not be removed.
}
