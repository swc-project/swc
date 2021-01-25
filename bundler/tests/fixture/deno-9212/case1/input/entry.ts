import * as ReactDom from "https://esm.sh/react-dom@17.0.1"
import * as React from "https://esm.sh/react@17.0.1"

const { document } = window as any

ReactDom.render(React.createElement('p', null, 'hello world!'), document.body)