// Leaves store an array of line strings. There are always line breaks
// between these strings. Leaves are limited in size and have to be
// contained in TextNode instances for bigger documents.
export class TextLeaf extends Text {
    constructor(text, length = textLength(text)) {
        super();
        this.text = text;
        this.length = length;
    }
    get lines() {
        return this.text.length;
    }
    get children() {
        return null;
    }
    lineInner(target, isLine, line, offset) {
        for (let i = 0; ; i++) {
            let string = this.text[i],
                end = offset + string.length;
            if ((isLine ? line : end) >= target)
                return new Line(offset, end, line, string);
            offset = end + 1;
            line++;
        }
    }
    decompose(from, to, target, open) {
        let text =
            from <= 0 && to >= this.length
                ? this
                : new TextLeaf(
                      sliceText(this.text, from, to),
                      Math.min(to, this.length) - Math.max(0, from)
                  );
        if (open & 1 /* From */) {
            let prev = target.pop();
            let joined = appendText(
                text.text,
                prev.text.slice(),
                0,
                text.length
            );
            if (joined.length <= 32 /* Branch */) {
                target.push(new TextLeaf(joined, prev.length + text.length));
            } else {
                let mid = joined.length >> 1;
                target.push(
                    new TextLeaf(joined.slice(0, mid)),
                    new TextLeaf(joined.slice(mid))
                );
            }
        } else {
            target.push(text);
        }
    }
    replace(from, to, text) {
        if (!(text instanceof TextLeaf)) return super.replace(from, to, text);
        let lines = appendText(
            this.text,
            appendText(text.text, sliceText(this.text, 0, from)),
            to
        );
        let newLen = this.length + text.length - (to - from);
        if (lines.length <= 32 /* Branch */) return new TextLeaf(lines, newLen);
        return TextNode.from(TextLeaf.split(lines, []), newLen);
    }
    sliceString(from, to = this.length, lineSep = "\n") {
        let result = "";
        for (let pos = 0, i = 0; pos <= to && i < this.text.length; i++) {
            let line = this.text[i],
                end = pos + line.length;
            if (pos > from && i) result += lineSep;
            if (from < end && to > pos)
                result += line.slice(Math.max(0, from - pos), to - pos);
            pos = end + 1;
        }
        return result;
    }
    flatten(target) {
        for (let line of this.text) target.push(line);
    }
    scanIdentical() {
        return 0;
    }
    static split(text, target) {
        let part = [],
            len = -1;
        for (let line of text) {
            part.push(line);
            len += line.length + 1;
            if (part.length == 32 /* Branch */) {
                target.push(new TextLeaf(part, len));
                part = [];
                len = -1;
            }
        }
        if (len > -1) target.push(new TextLeaf(part, len));
        return target;
    }
}

function textLength(text) {
    let length = -1;
    for (let line of text) length += line.length + 1;
    return length;
}
