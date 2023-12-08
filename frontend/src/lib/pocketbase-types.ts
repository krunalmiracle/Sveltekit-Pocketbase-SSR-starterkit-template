/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Address = "address",
	Availability = "availability",
	BankAccount = "bankAccount",
	BankCard = "bankCard",
	BillingAddress = "billingAddress",
	CustomTest = "custom_test",
	Profile = "profile",
	Service = "service",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AddressRecord = {
	addressLine1?: string
	city?: string
	country?: string
	countryCode?: string
	county?: string
	formattedAddress?: string
	houseNumber?: string
	latitude?: number
	longitude?: number
	postCode?: string
	state?: string
	stateCode?: string
	street?: string
	suburb?: string
	userId?: string
}

export enum AvailabilityWeekdayOptions {
	"EVERYDAY" = "EVERYDAY",
	"SUNDAY" = "SUNDAY",
	"MONDAY" = "MONDAY",
	"TUESDAY" = "TUESDAY",
	"WEDNESDAY" = "WEDNESDAY",
	"THURSDAY" = "THURSDAY",
	"FRIDAY" = "FRIDAY",
	"SATURDAY" = "SATURDAY",
}
export type AvailabilityRecord = {
	end?: number
	start?: number
	userId?: string
	weekday?: AvailabilityWeekdayOptions
}

export type BankAccountRecord = {
	accountNumber: string
	firstName: string
	lastName: string
	userId?: string
}

export type BankCardRecord = {
	cardNumber: string
	cvc: string
	firstName: string
	lastName: string
	month: number
	userId?: string
	year: number
}

export type BillingAddressRecord = {
	addressLine1?: string
	city?: string
	country?: string
	postCode?: string
	state?: string
	userId?: string
}

export type CustomTestRecord = {
	tests?: string[]
}

export enum ProfileCurrencyOptions {
	"EUR" = "EUR",
	"USD" = "USD",
	"BGN" = "BGN",
	"INR" = "INR",
}
export type ProfileRecord<TfullName = unknown> = {
	address?: RecordIdString
	availabilities?: RecordIdString[]
	avatar?: string
	bio: HTMLString
	currency: ProfileCurrencyOptions
	email?: string
	firstName: string
	fullName?: null | TfullName
	lastName: string
	services?: RecordIdString[]
	username?: string
	workRange: number
}

export enum ServiceServiceOptions {
	"BABYSITTER" = "BABYSITTER",
	"GARDENER" = "GARDENER",
	"HOMECLEAN" = "HOMECLEAN",
	"DRIVEWAYCLEAN" = "DRIVEWAYCLEAN",
	"CHAT" = "CHAT",
}
export type ServiceRecord = {
	hourlyRate: number
	service?: ServiceServiceOptions
	userId?: string
}

export enum UsersRoleOptions {
	"USER" = "USER",
	"WORKER" = "WORKER",
}

export enum UsersCurrencyOptions {
	"EUR" = "EUR",
	"USD" = "USD",
	"BGN" = "BGN",
	"INR" = "INR",
}

export enum UsersThemeOptions {
	"DEFAULT" = "DEFAULT",
	"KRUSKECHI" = "KRUSKECHI",
	"SILVIYA" = "SILVIYA",
}

export enum UsersModeOptions {
	"SYSTEM" = "SYSTEM",
	"LIGHT" = "LIGHT",
	"DARK" = "DARK",
}
export type UsersRecord = {
	address?: RecordIdString
	availabilities?: RecordIdString[]
	avatar?: string
	bankAccounts?: RecordIdString[]
	bankCards?: RecordIdString[]
	billingAddress?: RecordIdString
	bio: HTMLString
	currency: UsersCurrencyOptions
	dateOfBirth?: IsoDateString
	firstName: string
	lastName: string
	mode?: UsersModeOptions
	role: UsersRoleOptions
	services?: RecordIdString[]
	theme?: UsersThemeOptions
	workRange: number
}

// Response types include system fields and match responses from the PocketBase API
export type AddressResponse<Texpand = unknown> = Required<AddressRecord> & BaseSystemFields<Texpand>
export type AvailabilityResponse<Texpand = unknown> = Required<AvailabilityRecord> & BaseSystemFields<Texpand>
export type BankAccountResponse<Texpand = unknown> = Required<BankAccountRecord> & BaseSystemFields<Texpand>
export type BankCardResponse<Texpand = unknown> = Required<BankCardRecord> & BaseSystemFields<Texpand>
export type BillingAddressResponse<Texpand = unknown> = Required<BillingAddressRecord> & BaseSystemFields<Texpand>
export type CustomTestResponse<Texpand = unknown> = Required<CustomTestRecord> & BaseSystemFields<Texpand>
export type ProfileResponse<TfullName = unknown, Texpand = unknown> = Required<ProfileRecord<TfullName>> & BaseSystemFields<Texpand>
export type ServiceResponse<Texpand = unknown> = Required<ServiceRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	address: AddressRecord
	availability: AvailabilityRecord
	bankAccount: BankAccountRecord
	bankCard: BankCardRecord
	billingAddress: BillingAddressRecord
	custom_test: CustomTestRecord
	profile: ProfileRecord
	service: ServiceRecord
	users: UsersRecord
}

export type CollectionResponses = {
	address: AddressResponse
	availability: AvailabilityResponse
	bankAccount: BankAccountResponse
	bankCard: BankCardResponse
	billingAddress: BillingAddressResponse
	custom_test: CustomTestResponse
	profile: ProfileResponse
	service: ServiceResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'address'): RecordService<AddressResponse>
	collection(idOrName: 'availability'): RecordService<AvailabilityResponse>
	collection(idOrName: 'bankAccount'): RecordService<BankAccountResponse>
	collection(idOrName: 'bankCard'): RecordService<BankCardResponse>
	collection(idOrName: 'billingAddress'): RecordService<BillingAddressResponse>
	collection(idOrName: 'custom_test'): RecordService<CustomTestResponse>
	collection(idOrName: 'profile'): RecordService<ProfileResponse>
	collection(idOrName: 'service'): RecordService<ServiceResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
