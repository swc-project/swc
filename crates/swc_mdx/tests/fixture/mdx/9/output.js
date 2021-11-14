/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
  const _components = Object.assign({
    p: "p",
    em: "em"
  }, props.components), {wrapper: MDXLayout} = _components;
  const _content = <><_components.p><_components.em>{"z"}</_components.em></_components.p></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
