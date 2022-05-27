export const IndexPage = (a)=>{
    if (a === "loading") {
        return 1;
    } else if (a === "error") {
        return 2;
    } else {
        return 3;
    }
    return 4;
};
