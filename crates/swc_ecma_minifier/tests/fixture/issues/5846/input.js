function processNode(
    node: DataNode,
    index?: number,
    parent?: { node: DataNode; pos: string; level: number },
    pathNodes?: DataNode[],
) {
    const children = node ? node[mergeChildrenPropName] : dataNodes;
    const pos = node ? getPosition(parent.pos, index) : '0';
    const connectNodes = node ? [...pathNodes, node] : [];

    // Process node if is not root
    if (node) {
        const key: Key = syntheticGetKey(node, pos);
        const data = {
            node,
            index,
            pos,
            key,
            parentPos: parent.node ? parent.pos : null,
            level: parent.level + 1,
            nodes: connectNodes,
        };

        callback(data);
    }

    // Process children node
    if (children) {
        children.forEach((subNode, subIndex) => {
            processNode(
                subNode,
                subIndex,
                {
                    node,
                    pos,
                    level: parent ? parent.level + 1 : -1,
                },
                connectNodes,
            );
        });
    }
}

processNode(null);