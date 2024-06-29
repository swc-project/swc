function throttleTime(interval) {
    let currentValue, timeout;
    return (done)=>(value)=>{
            currentValue = value, timeout || (timeout = setTimeout(()=>{
                done(currentValue);
            }, interval));
        };
}
export { throttleTime };
