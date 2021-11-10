function combineOverlappingMatches(matches) {
    let hasOverlaps = false

    for (let i = matches.length - 1; i >= 0; i--) {
        let currentMatch = matches[i]
        let overlap = matches.find(match => {
            return match !== currentMatch && match.itemsType === currentMatch.itemsType
        })

        if (overlap) {
            hasOverlaps = true
            matches.splice(i, 1)
        }
    }

    if (hasOverlaps) {
        combineOverlappingMatches(matches)
    }
}

combineOverlappingMatches([1])