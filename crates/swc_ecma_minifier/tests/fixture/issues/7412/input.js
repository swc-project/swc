export function throttleTime(interval) {
    let currentValue;
    let timeout;

    return (done) => (value) => {
        currentValue = value;
        if (timeout) {
            return;
        }
        timeout = setTimeout(() => {
            done(currentValue);
        }, interval);
    };
}
