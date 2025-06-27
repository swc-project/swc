const type = () => {
    return null;
};

const widget = {
    component: {
        type,
    },
};

const render = () => {
    return <widget.component.type if="aaa" />;
};

<widget.component.type if={true} for="loop" while="waiting" null={null} />;
<widget.component.type if={true} null={null} for="loop" while="waiting" />;
