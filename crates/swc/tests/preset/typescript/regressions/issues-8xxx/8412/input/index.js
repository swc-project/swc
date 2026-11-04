export const fn = () => {
    let varA;
    if (condCheck) {
        // a bad comment
        varA = "a";
    } else {
        varA = "b";
    }
    return objCreator({
        varA,
    });
};
