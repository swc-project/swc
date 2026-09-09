const urlToString = URL.toString;
[
    URL,
    URL.toString = 0
].join("");
URL.toString = urlToString;
const urlSearchParamsToString = URLSearchParams.toString;
[
    URLSearchParams,
    URLSearchParams.toString = 0
].join("");
URLSearchParams.toString = urlSearchParamsToString;
const textDecoderToString = TextDecoder.toString;
[
    TextDecoder,
    TextDecoder.toString = 0
].join("");
TextDecoder.toString = textDecoderToString;
const textEncoderToString = TextEncoder.toString;
[
    TextEncoder,
    TextEncoder.toString = 0
].join("");
TextEncoder.toString = textEncoderToString;
const domExceptionToString = DOMException.toString;
[
    DOMException,
    DOMException.toString = 0
].join("");
DOMException.toString = domExceptionToString;
const alertToString = alert.toString;
[
    alert,
    alert.toString = 0
].join("");
alert.toString = alertToString;
const promptToString = prompt.toString;
[
    prompt,
    prompt.toString = 0
].join("");
prompt.toString = promptToString;
const confirmToString = confirm.toString;
[
    confirm,
    confirm.toString = 0
].join("");
confirm.toString = confirmToString;
