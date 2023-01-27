interface AccountType {
    accType: string
}

interface Account<T> {
    accountType: T
}

interface WithAccountHelpers<T> {
    accout: T;
    helpers: string;
}

const useAccount = <T>(): T => {
    return {} as T;
}

export const useProductAccount = useAccount<
    WithAccountHelpers<Account<AccountType>>
>