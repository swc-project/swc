async function runCounters() {
    for (const idebug of [1, 2, 3]) {
        setTimeout(() => console.log(`idebug = ${idebug}`), 100);
    }
}

runCounters();
runCounters();
