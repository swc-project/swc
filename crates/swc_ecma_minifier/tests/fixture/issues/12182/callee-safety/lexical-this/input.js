function readLexicalReceiver() {
    const lexicalReceiver = {
        read: () => this.value,
    };

    return lexicalReceiver.read();
}

console.log(readLexicalReceiver.call({ value: "lexical receiver" }));
