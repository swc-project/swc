var FRUITS = { MANGO: "mango" };

var getMangoLabel = (label) => label[FRUITS.MANGO];

export default (name) => {
    // Breaks with switch case
    switch (name) {
        case FRUITS.MANGO: {
            return getMangoLabel
        }
    }
    // Works with if else
    // if (name === FRUITS.MANGO) {
    //     return getMangoLabel;
    // }
};