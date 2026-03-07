@sealed class Service extends Base{@readonly prop=1;#value=2;@log method(@param arg){return this.#value+arg;}get value(){return this.#value;}set value(v){this.#value=v;}static{init();}}
