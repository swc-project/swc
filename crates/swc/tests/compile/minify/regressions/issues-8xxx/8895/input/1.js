class File {
    read() {
        return 'content';
    }
    [Symbol.dispose]() {
        console.log(`closing the file ...`);
    }
}
function main() {
    using file = new File();
    function readFile() {
        file.read();
        // ...
    }
    readFile();
}