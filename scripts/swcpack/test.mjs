import swc from '../../index.js'

await swc.swcpack(['files'], {
    esmLoader: (filename, a) => {
        return [filename, a];
    }
})