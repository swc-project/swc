import { spawn } from "child_process";

function log() {
    console.log(spawn);
}

const other = () => {
    const nestedClosure = () => {
        spawn("ls");
    };
};
