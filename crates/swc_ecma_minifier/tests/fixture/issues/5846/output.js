!function processNode(node, index, parent, pathNodes) {
    const children = node ? node[mergeChildrenPropName] : dataNodes, pos = node ? getPosition(parent.pos, index) : '0', connectNodes = node ? [
        ...pathNodes,
        node
    ] : [];
    if (node) {
        const key = syntheticGetKey(node, pos), data = {
            node,
            index,
            pos,
            key,
            parentPos: parent.node ? parent.pos : null,
            level: parent.level + 1,
            nodes: connectNodes
        };
        callback(data);
    }
    children && children.forEach((subNode, subIndex)=>{
        processNode(subNode, subIndex, {
            node,
            pos,
            level: parent ? parent.level + 1 : -1
        }, connectNodes);
    });
}(null);
