abstract class AbstractASI {
    f = 1/*missing ; */
    abstract method(): void
//  ;^^^^^^^^^^^^^^^^^^^^^^
    ["computed-method"]() {}
}
