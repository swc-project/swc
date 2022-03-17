import React from "react";
import { render } from "react-dom";

const array = ["one", "two", "three", "four"];

const WrapperWhereMagicHappens = (props) => {
    console.log("wrapper props", props);
    return <div>{props.children}</div>;
};
const ChildrenFail = (props) => {
    return array.map((label) => (
        <WrapperWhereMagicHappens {...props} key={label}>
            <h2>{label}</h2>
            {/*<div>{console.log(props.children) || props.children}</div>*/}
        </WrapperWhereMagicHappens>
    ));
};

const ChildrenOK = (props) => {
    return array.map((label) => (
        <WrapperWhereMagicHappens key={label} {...props}>
            <h2>{label}</h2>
            {/*<div>{console.log(props.children) || props.children}</div>*/}
        </WrapperWhereMagicHappens>
    ));
};

// const ChildrenButNotInAnArray = (props) => {
//     return (
//         <>
//             <WrapperWhereMagicHappens {...props} key="foo">
//                 <h2>Foo</h2>
//                 <div>
//                     {console.log("no array", props.children) || props.children}
//                 </div>
//             </WrapperWhereMagicHappens>
//         </>
//     );
// };

const App = () => {
    return (
        <>
            <ChildrenFail foo={1} bar={2}>
                <p>I'm a child</p>
            </ChildrenFail>
            <ChildrenOK foo={1} bar={2}>
                <p>I'm a child</p>
            </ChildrenOK>
        </>
    );
};

const main = () => {
    const root = document.getElementById("root");
    render(<App />, root);
};

main();