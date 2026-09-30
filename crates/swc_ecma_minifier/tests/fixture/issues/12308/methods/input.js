(async function () {
    console.log(await Promise.reject(1).catch(value => value));
    console.log(await Promise.reject(2).catch(value => value));
    console.log(JSON.stringify(await Promise.all([1, 2])));
    console.log(JSON.stringify(await Promise.all([3, 4])));
    console.log(JSON.stringify(await Promise.allSettled([1])));
    console.log(JSON.stringify(await Promise.allSettled([2])));
    console.log(await Promise.any([1, 2]));
    console.log(await Promise.any([3, 4]));
    console.log(await Promise.race([1, 2]));
    console.log(await Promise.race([3, 4]));
})();
