function switchResponseWrong(x: unknown): any {
    type End = isTrue<isUnknown<typeof x>>
}
