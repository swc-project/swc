export const IndexPage = (value) => {
    if (value === "loading") {
        return 1;
    } else if (value === "error") {
        return 2;
    } else {
        return 3;
    }
    return 4;
};
