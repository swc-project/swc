// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts

function EmptyPropSFC() {
    return <div> Default Greeting </div>;
}

function Greet(x: {name: string}) {
	return <div>Hello, {x}</div>;
}
function Meet({name = 'world'}) {
	return <div>Hello, {name}</div>;
}
function MeetAndGreet(k: {"prop-name": string}) {
	return <div>Hi Hi</div>;
}

// OK
let a = <Greet name='world' />;
let a1 = <Greet name='world' extra-prop />;
// Error
let b = <Greet naaame='world' />;

// OK
let c = <Meet />;
let c1 = <Meet extra-prop/>;
// OK
let d = <Meet name='me' />;
// Error
let e = <Meet name={42} />;
// Error
let f = <Meet naaaaaaame='no' />;

// OK
let g = <MeetAndGreet prop-name="Bob" />;
// Error
let h = <MeetAndGreet extra-prop-name="World" />;

// Error
let i = <EmptyPropSFC prop1 />
let i1 = <EmptyPropSFC ref={x => x.greeting.substr(10)} />

let o = {
    prop1: true;
}

// OK as access properties are allow when spread
let i2 = <EmptyPropSFC {...o} />

let o1: any;
// OK
let j = <EmptyPropSFC {...o1} />
let j1 = <EmptyPropSFC />
let j2 = <EmptyPropSFC data-prop />
let j3 = <EmptyPropSFC {...{}} />
let j4 = <EmptyPropSFC {...{ "data-info": "hi"}} />

