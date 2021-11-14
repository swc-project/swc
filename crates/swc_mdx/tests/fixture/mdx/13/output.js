/*@jsxRuntime automatic @jsxImportSource react*/ /*1*/
function MDXContent(props = {}) {
    const {
        wrapper: MDXLayout
    } = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();

    function _createMdxContent() {
        return <><>{"a "}{ }{" b"}</></>;
    }
}
export default MDXContent;
