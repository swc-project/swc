/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
  const _components = Object.assign({}, props.components), {X, wrapper: MDXLayout} = _components;
  const _content = <><X /></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
