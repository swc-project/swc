import { c as _c } from "react/compiler-runtime"; // @validateNoSetStateInRender @enableAssumeHooksFollowRulesOfReact
function Component(props) {
  const $ = _c(7);
  const logEvent = useLogging(props.appId);
  const [currentStep, setCurrentStep] = useState(0);
  let t0;
  if ($[0] !== logEvent) {
    t0 = (errorEvent) => {
      logEvent(errorEvent);
      setCurrentStep(1);
    };
    $[0] = logEvent;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const onSubmit = t0;

  switch (currentStep) {
    case 0: {
      let t1;
      if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = <OtherComponent data={{ foo: "bar" }} />;
        $[2] = t1;
      } else {
        t1 = $[2];
      }
      return t1;
    }
    case 1: {
      let t1;
      if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = { foo: "joe" };
        $[3] = t1;
      } else {
        t1 = $[3];
      }
      let t2;
      if ($[4] !== onSubmit) {
        t2 = <OtherComponent data={t1} onSubmit={onSubmit} />;
        $[4] = onSubmit;
        $[5] = t2;
      } else {
        t2 = $[5];
      }
      return t2;
    }
    default: {
      logEvent("Invalid step");
      let t1;
      if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = <OtherComponent data={null} />;
        $[6] = t1;
      } else {
        t1 = $[6];
      }
      return t1;
    }
  }
}
