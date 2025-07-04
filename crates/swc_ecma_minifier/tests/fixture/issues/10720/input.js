export function someFn({
    someVal,
    shouldBreak
}) {
    switch (someVal) {
        case 'one':
            // if there is a certain condition, we exit
            if (shouldBreak === 'break') {
                break
            }

            return 1
        default:
            return 0
    }

    // this code gets hit if we break
    return 11
}