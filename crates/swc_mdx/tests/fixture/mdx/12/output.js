/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
    const {
        wrapper: MDXLayout
    } = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();

    function _createMdxContent() {
        const {
            c
        } = props.components || ({});
        return <><><a:b /><c.d /></></>;
    }
}
export default MDXContent;