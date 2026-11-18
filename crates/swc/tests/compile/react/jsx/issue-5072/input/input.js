import React from "react";
import ReactDOM from "react-dom";
import { Button, Input } from "antd";
import Child from "./component/Child";

class Page extends React.Component {
    render() {
        return (
            <div className={"test"}>
                <div>Page</div>
                <Child />
                <input placeholder="我是谁?" />
                <Button>click me</Button>
                <Input />
            </div>
        );
    }
}