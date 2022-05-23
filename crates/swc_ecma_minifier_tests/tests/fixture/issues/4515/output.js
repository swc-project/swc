var getChildNodes$1;
B.c = {
    get foo () {
        for(var a = 1; a < 10; a++);
    }
};
export function setGetChildNodes(getChildNodesImpl) {
    getChildNodes$1 = getChildNodesImpl;
}
