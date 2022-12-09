function exampleFunction1() {
    return Math.random() > 0.5
        ? `<button               
        @click="${(): void => console.log('this line causes a syntax error')}"
      ></button>`
        : `<button               
        @click="${(): void => console.log('this line does NOT causes a syntax error')}"
      ></button>`;
}

function exampleFunction2() {
    return Math.random() > 0.5
        ? `<button               
        @click="${(): void => console.log('this line causes a syntax error')}"
      ></button>`
        : `<button               
        @click="${(): void => console.log('this line does NOT causes a syntax error')}"
      ></button>`;
}

function exampleFunction3() {
    return Math.random() > 0.5
        ? (): void => console.log('this line causes a syntax error')
        : (): void => console.log('this line does NOT causes a syntax error');
}

function exampleFunction4() {
    return Math.random() > 0.5
        ? function (): void { console.log('this line causes a syntax error') }
        : function (): void { console.log('this line does NOT causes a syntax error') };
}

function exampleFunction5() {
    return Math.random() > 0.5
        ? (function (): void { console.log('this line causes a syntax error') })
        : (function (): void { console.log('this line does NOT causes a syntax error') });
}

function exampleFunction6() {
    return Math.random() > 0.5
        ? foo`<button               
        @click="${(): void => console.log('this line causes a syntax error')}"
      ></button>`
        : bar`<button               
        @click="${(): void => console.log('this line does NOT causes a syntax error')}"
      ></button>`;
}