class LoggingButton extends React.Component {
    handleClick = () => {
        console.log("this is:", this);
    };
    m() {
        this;
    }
    static a = () => this;
}
