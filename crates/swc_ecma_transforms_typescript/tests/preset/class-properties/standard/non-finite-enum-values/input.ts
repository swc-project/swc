enum TemplateConstants {
    Positive = 1 / 0,
    Negative = -Positive,
    NotANumber = 0 / 0,
    PositiveText = `positive: ${Positive}!`,
    NegativeText = `negative: ${Negative}!`,
    NaNText = `nan: ${NotANumber}!`,
}
