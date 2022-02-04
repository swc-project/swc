class Message {
}
function saySize(message) {
    if (message instanceof Array) {
        return message.length; // Should have type Message[] here
    }
}
