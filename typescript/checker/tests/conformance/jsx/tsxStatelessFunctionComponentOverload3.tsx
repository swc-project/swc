// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts

interface Context {
    color: any;
}
declare function ZeroThingOrTwoThing(): JSX.Element;
declare function ZeroThingOrTwoThing(l: {yy: number, yy1: string}, context: Context): JSX.Element;

let obj2: any;

// OK
const two1 = <ZeroThingOrTwoThing />;
const two2 = <ZeroThingOrTwoThing yy={100}  yy1="hello"/>;
const two3 = <ZeroThingOrTwoThing {...obj2} />;  // it is just any so we allow it to pass through
const two4 = <ZeroThingOrTwoThing  yy={1000} {...obj2} />;  // it is just any so we allow it to pass through
const two5 = <ZeroThingOrTwoThing  {...obj2} yy={1000} />;  // it is just any so we allow it to pass through

declare function ThreeThing(l: {y1: string}): JSX.Element;
declare function ThreeThing(l: {y2: string}): JSX.Element;
declare function ThreeThing(l: {yy: number, yy1: string}, context: Context, updater: any): JSX.Element;

// OK
const three1 = <ThreeThing yy={99} yy1="hello world" />;
const three2 = <ThreeThing y2="Bye" />;
const three3 = <ThreeThing {...obj2} y2={10} />;  // it is just any so we allow it to pass through