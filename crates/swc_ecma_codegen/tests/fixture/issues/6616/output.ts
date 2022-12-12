type Custom<A> = {
    -readonly [P in keyof A]+?: A[P];
};
