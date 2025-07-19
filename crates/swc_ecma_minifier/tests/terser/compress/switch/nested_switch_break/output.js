function useMeow() {
    const state = 'init';
    const onMeow = () => {
        switch (state) {
            case 'init': {
                const innerCondition = getCondition();
                switch (innerCondition) {
                    case 'a':
                        break;
                    case 'b':
                        break;
                    default:
                        doSomething();
                }
                break;
            }
            default: {
                doSomething();
                break;
            }
        }
    };
    return {
        onMeow,
    };
}