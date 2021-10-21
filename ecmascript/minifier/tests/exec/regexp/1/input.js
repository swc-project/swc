

export function compile(attributePattern, flags) {
    return new RegExp(`(?:^|;)\\s*${attributePattern}\s*=\s*([^";\s][^;\s]*|"(?:[^"\\]|\\"?)+"?)`, flags);
}