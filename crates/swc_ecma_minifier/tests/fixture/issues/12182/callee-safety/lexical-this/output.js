function readLexicalReceiver() {
    const lexicalReceiver_read = ()=>this.value;
    return lexicalReceiver_read();
}
console.log(readLexicalReceiver.call({
    value: "lexical receiver"
}));
