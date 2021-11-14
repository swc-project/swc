/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
    const {
        wrapper: MDXLayout
    } = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();

    function _createMdxContent() {
        const _components = Object.assign({
            p: "p"
        }, props.components);
        return <_components.p>{"Hello "}{props.name}</_components.p>;
    }
}
export default MDXContent;