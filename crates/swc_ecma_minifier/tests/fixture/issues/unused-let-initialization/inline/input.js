const getDefault = () => 1;

const getCountry = () => {
    const localCountry = read();
    return localCountry || fallback() || localCountry;
};

export function demo(props) {
    const storageRegion = getCountry();
    const { value = getDefault(storageRegion) } = props;
    return value;
}
