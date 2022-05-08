B.c = {
    get foo() {
        for (var a = 1; a < 10; a++) {}
    },
};

var getChildNodes$1;
export function setGetChildNodes(getChildNodesImpl) {
    getChildNodes$1 = getChildNodesImpl;
}
