export function demo(props) {
    let localCountry;
    localCountry = read(), localCountry || fallback();
    let { value = 1 } = props;
    return value;
}
