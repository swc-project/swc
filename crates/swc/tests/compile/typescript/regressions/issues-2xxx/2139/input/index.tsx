export default class ReusablePayments extends PureComponent<Props> {
    public componentDidMount() {
        this.setDefaultReusablePayment();
    }

    public componentDidUpdate(prevProps: Props) {
        if (
            prevProps.reusablePaymentSources !==
            this.props.reusablePaymentSources
        ) {
            this.setDefaultReusablePayment();
        }
    }

    private setDefaultReusablePayment(
        skipPaymentSource?: StripePaymentSourceFragment
    ) {
        const { reusablePaymentSources, selectedReusablePayment, onChange } =
            this.props;

        const validReusablePaymentSources = reusablePaymentSources.filter(
            (ps) =>
                ps.__typename === "StripePaymentSource" &&
                ps !== skipPaymentSource
        ) as Array<StripePaymentSourceFragment>;

        if (selectedReusablePayment === null) {
            return;
        }

        if (
            selectedReusablePayment &&
            validReusablePaymentSources.find(
                (ps) => ps === selectedReusablePayment
            )
        ) {
            // selectedReusablePayment still valid
            return;
        }

        if (!validReusablePaymentSources.length) {
            onChange(null);
            return;
        }

        const ps = validReusablePaymentSources.find((ps) => ps.isDefault);
        onChange(ps || validReusablePaymentSources[0]);
    }

    private handleSelectPayment = (selected: StripePaymentSourceFragment) => {
        return this.props.onChange(selected);
    };

    private handleDeletePaymentSource = (
        id: string,
        deletePaymentSource: DeletePaymentSourceMutationFn
    ) => {
        const { selectedReusablePayment, onChange } = this.props;

        if (
            onChange &&
            selectedReusablePayment &&
            selectedReusablePayment.id === id
        ) {
            this.setDefaultReusablePayment(selectedReusablePayment);
        }

        deletePaymentSource({
            variables: {
                id,
            },
        });
    };

    public render() {
        const { selectedReusablePayment, reusablePaymentSources } = this.props;

        const stripePaymentSources = reusablePaymentSources.filter(
            (ps) => ps.__typename === "StripePaymentSource"
        ) as Array<StripePaymentSourceFragment>;

        if (!stripePaymentSources.length) {
            return null;
        }

        return (
            <DeletePaymentSourceComponent
                onCompleted={({ deletePaymentSource }) => {
                    if (deletePaymentSource.success) {
                        toast.success("Successfully removed Card");
                        return;
                    }

                    toast.error(deletePaymentSource.error);
                }}
                onError={(error) => {
                    toast.error(error.message);
                }}
                refetchQueries={["ReusablePaymentSources"]}
            >
                {(deletePaymentSource) => (
                    <div className={styles.selectionList}>
                        {stripePaymentSources.map((payment) => {
                            const cardIcon =
                                "brand" in payment.paymentEntity ? (
                                    payment.paymentEntity.brand === "Visa" ? (
                                        <Visa />
                                    ) : payment.paymentEntity.brand ===
                                      "MasterCard" ? (
                                        <MasterCard />
                                    ) : payment.paymentEntity.brand ===
                                      "American Express" ? (
                                        <AmericanExpress />
                                    ) : payment.paymentEntity.brand ===
                                      "Discover" ? (
                                        <Discover />
                                    ) : null
                                ) : null;
                            return (
                                <div
                                    key={payment.id}
                                    className={classNames(styles.creditCard, {
                                        [styles.creditCardChecked]:
                                            selectedReusablePayment === payment,
                                    })}
                                >
                                    <div className={styles.creditCardContainer}>
                                        <Radio
                                            value={payment.id}
                                            checked={
                                                selectedReusablePayment ===
                                                payment
                                            }
                                            onChange={this.handleSelectPayment.bind(
                                                this,
                                                payment
                                            )}
                                        >
                                            <div
                                                className={styles.paymentHeader}
                                            >
                                                <div
                                                    className={
                                                        styles.paymentHeaderContainer
                                                    }
                                                >
                                                    {cardIcon}
                                                    {payment.paymentEntity
                                                        .__typename ===
                                                        "PaymentCard" && (
                                                        <div
                                                            className={
                                                                styles.textBold
                                                            }
                                                        >
                                                            {
                                                                payment
                                                                    .paymentEntity
                                                                    .brand
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.textSmall}
                                                >
                                                    {payment.owner &&
                                                        (payment.owner
                                                            .verifiedName ||
                                                            payment.owner
                                                                .name)}{" "}
                                                    -
                                                    {payment.paymentEntity
                                                        .__typename ===
                                                        "PaymentCard" &&
                                                        ` xxx ${payment.paymentEntity.last4}`}
                                                </div>
                                            </div>
                                        </Radio>
                                        <div
                                            className={styles.creditCardActions}
                                        >
                                            <Button
                                                onClick={this.handleDeletePaymentSource.bind(
                                                    this,
                                                    payment.id,
                                                    deletePaymentSource
                                                )}
                                                className={
                                                    styles.removeCardButton
                                                }
                                                variant="secondary-link"
                                                type="button"
                                                size="xsmall"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </DeletePaymentSourceComponent>
        );
    }
}
