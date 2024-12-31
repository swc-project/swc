import React from "react";

export class Component<T> extends React.PureComponent<{}, {}> {

    render(): React.ReactNode {
        return <div>Hello world</div>;
    }
}