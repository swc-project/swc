function MDXContent(props = {
}) {
    const { wrapper: MDXLayout  } = props.components || {
    };
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();
    function _createMdxContent() {
        return <a {...b} c d="1" e={1}/>;
    }
}
export default MDXContent;
