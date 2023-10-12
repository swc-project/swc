const a = () => ({
    [this](a = this) { this; arguments },
})
const b = () => class {
    static [this]() { }
    [arguments]() { }
}