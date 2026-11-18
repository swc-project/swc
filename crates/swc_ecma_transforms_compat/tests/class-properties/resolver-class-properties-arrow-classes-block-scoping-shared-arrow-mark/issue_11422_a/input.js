
class Sub {}

class Test extends Sub {
  isWaitContentRender = false;
  renderOverlay = async () => {
    (() => {
      console.log(this, "__123___");
    })();
  };
}

const test = new Test();
const render = test.renderOverlay;

render();
