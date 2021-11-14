/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
  const _components = Object.assign({
    h1: "h1"
  }, props.components), {wrapper: MDXLayout} = _components;
  const _content = <><_components.h1>{"hi!"}</_components.h1></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
