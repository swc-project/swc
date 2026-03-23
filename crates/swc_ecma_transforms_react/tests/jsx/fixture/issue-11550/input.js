// Newline in quoted JSX attribute value should be escaped, not collapsed to space
// https://github.com/swc-project/swc/issues/11550
const hello = <div data-anything="bruh
bruh">hello</div>;
