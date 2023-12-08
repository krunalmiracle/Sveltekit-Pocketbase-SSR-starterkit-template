export interface IErrorPocketbaseRecordUpdate {
    code: number
    message: string
    data: Record<string, never> | {
        [index: string]: {
            code: string,
            message: string
        }
    }
}

export interface IUser {
    id: string
    avatar_url: string | undefined
    username: string | undefined
    email: string | undefined
    firstName: string
    lastName: string | undefined
    dateOfBirth: string | undefined
    phoneNumber: string | undefined
    role: number
    updated: string | undefined
    created: string | undefined
    website: string | undefined
    address: string,
    paymentDetail: [
        string
    ],
}

export interface IUserExpanded {
    id: string
    avatar_url: string | undefined
    username: string | undefined
    email: string | undefined
    firstName: string
    lastName: string | undefined
    dateOfBirth: string | undefined
    phoneNumber: string | undefined
    role: number
    updated: string | undefined
    created: string | undefined
    website: string | undefined
    address: string,
    paymentDetail: [
        string
    ],
    expand: {
        address: IAddress | undefined
        paymentDetail: [IPaymentDetail]
    } | undefined
}
export interface IPaymentDetail {
    id: string | undefined,
    collectionId: string | undefined,
    collectionName: string | undefined,
    created: string | undefined,
    updated: string | undefined,
    accountFullName: string | undefined,
    accountNumber: string | undefined,
    expirationDate: string | undefined,
    currency: string | undefined
}
export interface IAddress {
    id: string | undefined
    collectionId: string | undefined
    collectionName: string | undefined
    street: string | undefined
    city: string | undefined,
    state: string | undefined,
    country: string | undefined,
    postalCode: string | undefined,
}