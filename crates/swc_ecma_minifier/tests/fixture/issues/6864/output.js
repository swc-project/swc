function removeFromMatrix(matrix, id) {
    var newMatrix, indexOfIdToRemove, row = _.find(matrix, (entry, index)=>{
        if (_.includes(entry, id)) return indexOfIdToRemove = index, entry;
    });
    if (!row) return matrix;
    if (1 === row.length) {
        if (2 === (newMatrix = _.without(matrix, row))[0].length) {
            const remainingEntry = newMatrix[0];
            newMatrix = [
                [
                    remainingEntry[0]
                ],
                [
                    remainingEntry[1]
                ]
            ];
        }
    } else (newMatrix = [
        ...matrix
    ])[indexOfIdToRemove] = _.without(row, id);
    return newMatrix || matrix;
}
export { removeFromMatrix };
