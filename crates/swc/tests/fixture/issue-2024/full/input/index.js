(async () => {
    const sleep = () => new Promise(resolve => setTimeout(() => resolve(undefined), 500));
    const result = (await sleep()) || 'fallback';
    console.log(result);
})();