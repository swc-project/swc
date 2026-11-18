
class Sub {

}

class Test extends Sub {
  isWaitContentRender = false
  renderOverlay = async () => {
    (() => {
      return this;
    })()
  }
}

const test = new Test()
const render = test.renderOverlay
