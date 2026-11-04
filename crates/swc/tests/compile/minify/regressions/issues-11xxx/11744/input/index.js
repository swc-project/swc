function Component(target) {
  return class subTarget extends target { };
}

@Component
class ScrollView {
  static scrollInterval = 100;
  autoScroll() {
    console.log(ScrollView.scrollInterval)
  }
}

new ScrollView().autoScroll();