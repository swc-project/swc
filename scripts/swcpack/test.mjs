import swc from '../../index.js'

await swc.swcpack(['files'], {
    esmLoader: (_, filename, a) => {
        console.log(filename);
        console.log(a);
        return [filename, a];
    }
})