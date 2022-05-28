import swc from '../../index.js'

const res = await swc.swcpack(['files'], {
    loadEsm: async (filename) => {
        console.log(filename);
        return filename;
    }
})
console.log(`Result:`, res);