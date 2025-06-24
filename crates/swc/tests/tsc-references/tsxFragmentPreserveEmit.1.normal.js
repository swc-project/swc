//// [file.tsx]
<></>; // no whitespace
<></>; // lots of whitespace
<></>; // comments in the tags
<>hi</>; // text inside
<><span>hi</span><div>bye</div></>; // children
<><span>1</span><><span>2.1</span><span>2.2</span></><span>3</span></>; // nested fragments
<>#</>; // # would cause scanning error if not in jsxtext
