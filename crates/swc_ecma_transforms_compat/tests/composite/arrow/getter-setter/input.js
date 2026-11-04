const a = () => ({
    get this() { this; arguments },
    set arguments(a = this) { this; arguments },
    get [this]() { this; arguments },
})