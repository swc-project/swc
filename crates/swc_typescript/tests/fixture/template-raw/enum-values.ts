export enum Values {
    Plain = `\x41`,
    Interpolated = `\n${Plain}\\`,
    Number = `\u{1F600}${42}\uD800`,
}
