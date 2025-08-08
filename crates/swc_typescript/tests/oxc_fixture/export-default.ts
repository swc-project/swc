const defaultDelimitersClose = new Uint8Array([125, 125]);

/** comment should be a leading comment of the class */
export default class Tokenizer {
	public delimiterClose: Uint8Array = defaultDelimitersClose;
}
