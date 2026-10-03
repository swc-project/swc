namespace N {
    export function Component() { return <div />; }
    Component();
}
namespace N {
    export const element = <Component />;
}
console.log(N.element);
