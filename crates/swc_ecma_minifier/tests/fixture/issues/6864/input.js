export function removeFromMatrix(matrix, id) {
    var newMatrix;
    var indexOfIdToRemove;

    var row = _.find(matrix, (entry, index) => {
        if (_.includes(entry, id)) {
            indexOfIdToRemove = index;
            return entry;
        }
    });

    if (!row) {
        return matrix;
    }

    if (row.length === 1) {
        newMatrix = _.without(matrix, row);

        if (newMatrix[0].length === 2) {
            const remainingEntry = newMatrix[0];
            newMatrix = [[remainingEntry[0]], [remainingEntry[1]]];
        }
    } else {
        newMatrix = [...matrix];
        newMatrix[indexOfIdToRemove] = _.without(row, id);
    }

    return newMatrix || matrix;
}
