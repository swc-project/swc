export const IndexPage = (e)=>{
    if (e === "loading") {
        return 1;
    } else if (e === "error") {
        return 2;
    } else {
        return 3;
    }
    return 4;
};
