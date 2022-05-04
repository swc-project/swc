class PartWriter implements Deno.Writer {
    constructor(
        private writer: Deno.Writer,
        readonly boundary: string,
        public headers: Headers,
        isFirstBoundary: boolean
    ) {
        let buf = "";
        if (isFirstBoundary) {
            buf += `--${boundary}\r\n`;
        } else {
            buf += `\r\n--${boundary}\r\n`;
        }
        for (const [key, value] of headers.entries()) {
            buf += `${key}: ${value}\r\n`;
        }
        buf += `\r\n`;
        this.partHeader = buf;
    }
}
