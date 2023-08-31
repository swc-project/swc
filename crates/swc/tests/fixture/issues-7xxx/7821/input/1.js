const Blocks = {
    Block1: () => {
        return <>'Block1xx'</>;
    },
    Block2: () => {
        return <>'Block2xx'</>;
    },
    Layout1: () => {
        // In the final code, Blocks does not have a 'Block1' key
        return RenderLayout(Blocks, ['Block1'])
    }
};

function RenderLayout(Comps, items) {
    return items.map((item) => {
        return Comps[item]
    })
}

export function render() {
    return <Blocks.Layout1 />
}
