import swc from '../../index.js'

const res = await swc.swcpack(['files'], {
    esmLoader: (_, filename, a) => {
        console.log(filename);
        console.log(a);
        return [filename, a];
    }
})
console.log(`Result:`, res);