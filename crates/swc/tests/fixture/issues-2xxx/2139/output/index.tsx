import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
class ReusablePayments extends PureComponent {
    componentDidMount() {
        this.setDefaultReusablePayment();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.reusablePaymentSources !== this.props.reusablePaymentSources) {
            this.setDefaultReusablePayment();
        }
    }
    setDefaultReusablePayment(skipPaymentSource) {
        var _this_props = this.props, reusablePaymentSources = _this_props.reusablePaymentSources, selectedReusablePayment = _this_props.selectedReusablePayment, onChange = _this_props.onChange;
        var validReusablePaymentSources = reusablePaymentSources.filter((ps)=>ps.__typename === "StripePaymentSource" && ps !== skipPaymentSource);
        if (selectedReusablePayment === null) {
            return;
        }
        if (selectedReusablePayment && validReusablePaymentSources.find((ps)=>ps === selectedReusablePayment)) {
            // selectedReusablePayment still valid
            return;
        }
        if (!validReusablePaymentSources.length) {
            onChange(null);
            return;
        }
        var ps = validReusablePaymentSources.find((ps)=>ps.isDefault);
        onChange(ps || validReusablePaymentSources[0]);
    }
    render() {
        var _this_props = this.props, selectedReusablePayment = _this_props.selectedReusablePayment, reusablePaymentSources = _this_props.reusablePaymentSources;
        var stripePaymentSources = reusablePaymentSources.filter((ps)=>ps.__typename === "StripePaymentSource");
        if (!stripePaymentSources.length) {
            return null;
        }
        return /*#__PURE__*/ _jsx(DeletePaymentSourceComponent, {
            onCompleted: (param)=>{
                var deletePaymentSource = param.deletePaymentSource;
                if (deletePaymentSource.success) {
                    toast.success("Successfully removed Card");
                    return;
                }
                toast.error(deletePaymentSource.error);
            },
            onError: (error)=>{
                toast.error(error.message);
            },
            refetchQueries: [
                "ReusablePaymentSources"
            ],
            children: (deletePaymentSource)=>/*#__PURE__*/ _jsx("div", {
                    className: styles.selectionList,
                    children: stripePaymentSources.map((payment)=>{
                        var cardIcon = "brand" in payment.paymentEntity ? payment.paymentEntity.brand === "Visa" ? /*#__PURE__*/ _jsx(Visa, {}) : payment.paymentEntity.brand === "MasterCard" ? /*#__PURE__*/ _jsx(MasterCard, {}) : payment.paymentEntity.brand === "American Express" ? /*#__PURE__*/ _jsx(AmericanExpress, {}) : payment.paymentEntity.brand === "Discover" ? /*#__PURE__*/ _jsx(Discover, {}) : null : null;
                        return /*#__PURE__*/ _jsx("div", {
                            className: classNames(styles.creditCard, {
                                [styles.creditCardChecked]: selectedReusablePayment === payment
                            }),
                            children: /*#__PURE__*/ _jsxs("div", {
                                className: styles.creditCardContainer,
                                children: [
                                    /*#__PURE__*/ _jsx(Radio, {
                                        value: payment.id,
                                        checked: selectedReusablePayment === payment,
                                        onChange: this.handleSelectPayment.bind(this, payment),
                                        children: /*#__PURE__*/ _jsxs("div", {
                                            className: styles.paymentHeader,
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: styles.paymentHeaderContainer,
                                                    children: [
                                                        cardIcon,
                                                        payment.paymentEntity.__typename === "PaymentCard" && /*#__PURE__*/ _jsx("div", {
                                                            className: styles.textBold,
                                                            children: payment.paymentEntity.brand
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: styles.textSmall,
                                                    children: [
                                                        payment.owner && (payment.owner.verifiedName || payment.owner.name),
                                                        " ",
                                                        "-",
                                                        payment.paymentEntity.__typename === "PaymentCard" && ` xxx ${payment.paymentEntity.last4}`
                                                    ]
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ _jsx("div", {
                                        className: styles.creditCardActions,
                                        children: /*#__PURE__*/ _jsx(Button, {
                                            onClick: this.handleDeletePaymentSource.bind(this, payment.id, deletePaymentSource),
                                            className: styles.removeCardButton,
                                            variant: "secondary-link",
                                            type: "button",
                                            size: "xsmall",
                                            children: "Remove"
                                        })
                                    })
                                ]
                            })
                        }, payment.id);
                    })
                })
        });
    }
    constructor(...args){
        super(...args), _define_property(this, "handleSelectPayment", (selected)=>{
            return this.props.onChange(selected);
        }), _define_property(this, "handleDeletePaymentSource", (id, deletePaymentSource)=>{
            var _this_props = this.props, selectedReusablePayment = _this_props.selectedReusablePayment, onChange = _this_props.onChange;
            if (onChange && selectedReusablePayment && selectedReusablePayment.id === id) {
                this.setDefaultReusablePayment(selectedReusablePayment);
            }
            deletePaymentSource({
                variables: {
                    id
                }
            });
        });
    }
}
export { ReusablePayments as default };
