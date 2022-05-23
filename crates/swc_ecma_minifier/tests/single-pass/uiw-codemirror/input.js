export class TextLeaf extends Text {
    constructor(
        text1,
        length1 = (function textLength(text) {
            let length = -1;
            for (let line of text) length += line.length + 1;
            return length;
        })(text1)
    ) {
        super(), (this.text = text1), (this.length = length1);
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
            (offset = end + 1), line++;
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
        if (1 & open) {
            let prev = target.pop(),
                joined = appendText(
                    text.text,
                    prev.text.slice(),
                    0,
                    text.length
                );
            if (joined.length <= 32)
                target.push(new TextLeaf(joined, prev.length + text.length));
            else {
                let mid = joined.length >> 1;
                target.push(
                    new TextLeaf(joined.slice(0, mid)),
                    new TextLeaf(joined.slice(mid))
                );
            }
        } else target.push(text);
    }
    replace(from, to, text) {
        if (!(text instanceof TextLeaf)) return super.replace(from, to, text);
        let lines = appendText(
                this.text,
                appendText(text.text, sliceText(this.text, 0, from)),
                to
            ),
            newLen = this.length + text.length - (to - from);
        return lines.length <= 32
            ? new TextLeaf(lines, newLen)
            : TextNode.from(TextLeaf.split(lines, []), newLen);
    }
    sliceString(from, to = this.length, lineSep = "\n") {
        let result = "";
        for (let pos = 0, i = 0; pos <= to && i < this.text.length; i++) {
            let line = this.text[i],
                end = pos + line.length;
            pos > from && i && (result += lineSep),
                from < end &&
                    to > pos &&
                    (result += line.slice(Math.max(0, from - pos), to - pos)),
                (pos = end + 1);
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
        for (let line of text)
            part.push(line),
                (len += line.length + 1),
                32 == part.length &&
                    (target.push(new TextLeaf(part, len)),
                    (part = []),
                    (len = -1));
        return len > -1 && target.push(new TextLeaf(part, len)), target;
    }
}
