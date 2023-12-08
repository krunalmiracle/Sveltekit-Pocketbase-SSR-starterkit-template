import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES } from '$lib/constants';


// Email schema
export const emailSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Email address invalid" }).min(3, { message: "Must be 3 or more characters long" }).max(128, { message: "Must be 124 or fewer characters long" }),
});

// Email password recovery schema
export const passwordSchema = z.object({
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
});

// Password Reset schema
export const passwordResetSchema = z.object({
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    passwordConfirm: z.string({
        required_error: "Password Confirm is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
});
// Email login User Schema
export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Email address invalid" }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
});
// Phone Number login Schema
export const phoneLoginSchema = z.object({
    phoneNumber: z.string({
        required_error: "phoneNumber is required",
        invalid_type_error: "phoneNumber must be valid",
    }).regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, { message: "Phone number not valid" }).optional(),
});
// Bank Account Schema
export const bankAccountSchema = z.object({
    id: z.string().optional(),
    accountNumber: z.string({
        required_error: "Account Number is required",
        invalid_type_error: "Account Number must be valid",
    }).transform((val, ctx) => {
        if (!(/^AL\d{10}[0-9A-Z]{16}$|^AD\d{10}[0-9A-Z]{12}$|^AT\d{18}$|^BH\d{2}[A-Z]{4}[0-9A-Z]{14}$|^BE\d{14}$|^BA\d{18}$|^BG\d{2}[A-Z]{4}\d{6}[0-9A-Z]{8}$|^HR\d{19}$|^CY\d{10}[0-9A-Z]{16}$|^CZ\d{22}$|^DK\d{16}$|^FO\d{16}$|^GL\d{16}$|^DO\d{2}[0-9A-Z]{4}\d{20}$|^EE\d{18}$|^FI\d{16}$|^FR\d{12}[0-9A-Z]{11}\d{2}$|^GE\d{2}[A-Z]{2}\d{16}$|^DE\d{20}$|^GI\d{2}[A-Z]{4}[0-9A-Z]{15}$|^GR\d{9}[0-9A-Z]{16}$|^HU\d{26}$|^IS\d{24}$|^IE\d{2}[A-Z]{4}\d{14}$|^IL\d{21}$|^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^[A-Z]{2}\d{5}[0-9A-Z]{13}$|^KW\d{2}[A-Z]{4}22!$|^LV\d{2}[A-Z]{4}[0-9A-Z]{13}$|^LB\d{6}[0-9A-Z]{20}$|^LI\d{7}[0-9A-Z]{12}$|^LT\d{18}$|^LU\d{5}[0-9A-Z]{13}$|^MK\d{5}[0-9A-Z]{10}\d{2}$|^MT\d{2}[A-Z]{4}\d{5}[0-9A-Z]{18}$|^MR13\d{23}$|^MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}$|^MC\d{12}[0-9A-Z]{11}\d{2}$|^ME\d{20}$|^NL\d{2}[A-Z]{4}\d{10}$|^NO\d{13}$|^PL\d{10}[0-9A-Z]{,16}n$|^PT\d{23}$|^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$|^SM\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^SA\d{4}[0-9A-Z]{18}$|^RS\d{20}$|^SK\d{22}$|^SI\d{17}$|^ES\d{22}$|^SE\d{22}$|^CH\d{7}[0-9A-Z]{12}$|^TN59\d{20}$|^TR\d{7}[0-9A-Z]{17}$|^AE\d{21}$|^GB\d{2}[A-Z]{4}\d{14}$/.test(val))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Not a account number",
            });

        }
        return val;
    }),
    firstName: z.string({
        required_error: "firstName is required",
        invalid_type_error: "firstName must be valid",
    }),
    lastName: z.string({
        required_error: "lastName is required",
        invalid_type_error: "lastName must be valid",
    }),
});
// Bank Card Schema
export const bankCardSchema = z.object({
    id: z.string().optional(),
    cardNumber: z.string({
        required_error: "Card Number is required",
        invalid_type_error: "Card Number must be valid",
    }),
    cvc: z.number({
        required_error: "CVC is required",
        invalid_type_error: "CVC must be valid",
    }),
    month: z.number().min(1).max(12),
    year: z.number().min(23).max(99),
    firstName: z.string({
        required_error: "firstName is required",
        invalid_type_error: "firstName must be valid",
    }),
    lastName: z.string({
        required_error: "lastName is required",
        invalid_type_error: "lastName must be valid",
    }),
});
// Address Edit Schema
export const addressSchema = z.object({
    id: z.string().optional(),
    addressLine1: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postCode: z.string().optional(),
}).superRefine(({ addressLine1, street, city, state, country, postCode }, ctx) => {
    if (!addressLine1 && !street && !city && state && !country && !postCode) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Atleast one shouldn\'t be null',
            path: ['addressLine1', 'street', 'city', 'state', 'country', 'postCode']
        });
    }
});

export const billingAddressSchema = z.object({
    id: z.string().optional(),
    addressLine1: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postCode: z.string().optional(),
}).superRefine(({ addressLine1, street, city, state, country, postCode }, ctx) => {
    if (!addressLine1 && !street && !city && state && !country && !postCode) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Atleast one shouldn\'t be null',
            path: ['addressLine1', 'street', 'city', 'state', 'country', 'postCode']
        });
    }
});
// Profile
export const profileEditSchema = z.object({
    avatar_url: z.optional(z.string()),
    avatar: z.optional(z.any()
        .refine((file) => file?.size >= 0, 'File does not exist')
        .refine((file) => file?.size <= 5000000, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        )),
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 32 or fewer characters long" }),
    website: z.string({
        invalid_type_error: "Username must be a string",
    }).optional(),
    dateOfBirth: z.coerce.date({
        required_error: "Please select a date",
        invalid_type_error: "That's not a date!",
    }).min(new Date("1900-01-01"), { message: "Too old" }).max(new Date(), { message: "Too young!" }),
    firstName: z.string({
        required_error: "firstName is required",
        invalid_type_error: "firstName must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
    lastName: z.string({
        required_error: "lastName is required",
        invalid_type_error: "lastName must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
    role: z.number({
        required_error: "Role is required",
        invalid_type_error: "Role must be customer or vendor",
    }).min(0, { message: "Must be customer or vendor" }).max(1, { message: "Must be customer or vendor" }),
    phoneNumber: z.string({
        required_error: "Phone Number is required",
        invalid_type_error: "Phone Number must be valid",
    }).regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, { message: "Phone number not valid" }).optional(),
    oldPassword: z.string({
        required_error: "Old Password is required",
        invalid_type_error: "Old Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
    passwordConfirm: z.string({
        required_error: "Password Confirm is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
}).superRefine(({ oldPassword, password }, ctx) => {
    if (oldPassword && !password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'New Password',
            path: ['password']
        });
    }
    if (!oldPassword && password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Old Password is required',
            path: ['oldPassword']
        });
    }
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
});

// Register Schema
export const registerSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Email address invalid" }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    firstName: z.string({
        required_error: "firstName is required",
        invalid_type_error: "firstName must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    lastName: z.string({
        required_error: "lastName is required",
        invalid_type_error: "lastName must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    passwordConfirm: z.string({
        required_error: "Password Confirm is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    role: z.enum(["USER", "WORKER"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be parent or sitter",
    })
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
})
// Services Provided by worker schema
export const servicesprovidedSchema = z.object({
    id: z.string().optional(),
    service: z.enum(["BABYSITTER", "GARDENER", "HOMECLEAN", "DRIVEWAYCLEAN", "CHAT"], { required_error: "Service is required", invalid_type_error: "Service must be babysitter,gardener, homecleaner, drivecleaner, chat" }),
    hourlyRate: z.number({ required_error: "Hourly Rate is required", invalid_type_error: "Must be a number" }).positive("Hourly Rate should be higher than 0").max(10000.0, { message: "Hourly Rate too high" }),
});
// Working time or availability by worker schema
export const availabilitySchema = z.object({
    id: z.string().optional(),
    start: z.string({
        required_error: "Please select a start time",
        invalid_type_error: "That's not a start time"
    }).transform((val, ctx) => {
        if (!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?((AM)?|(PM))?$/.test(val))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Not in correct Date format HH:MM AM/PM or HH:MM",
            });
        }
        const timeParts = val.split(':');
        return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + (val.includes('PM') ? 12 * 60 : 0);
    }),
    end: z.string({
        required_error: "Please select a end time",
        invalid_type_error: "That's not a end time"
    }).transform((val, ctx) => {
        if (!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?((AM)?|(PM))?$/.test(val))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Not in correct Date format HH:MM AM/PM or HH:MM",
            });
        }
        const timeParts = val.split(':');
        return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + (val.includes('PM') ? 12 * 60 : 0);
    }),
    weekday: z.enum(["EVERYDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"], {
        required_error: "Weekday is required",
        invalid_type_error: "Weekday must be a string",
    }),
});
// Bio Schema
export const bioSchema = z.object({
    id: z.string().optional(),
    bio: z.string({
        required_error: "Introduction short text is required",
        invalid_type_error: "Introduction can only be text",
    }).min(4, { message: "Must be 6 or more characters long" }).max(3000, { message: "Must be 3000 or fewer characters long" })
});
// Avatar Schema
export const avatarSchema = z.object({
    id: z.string().optional(),
    avatar: z.string().optional()
});
// Role Schema
export const roleSchema = z.object({
    id: z.string().optional(),
    role: z.enum(["USER", "WORKER"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be parent or sitter",
    })
});

export const changePasswordSchema = z.object({
    id: z.string().optional(),
    oldPassword: z.string({
        required_error: "Old Password is required",
        invalid_type_error: "Old Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
    password: z.string({
        required_error: "New Password is required",
        invalid_type_error: "New Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
    passwordConfirm: z.string({
        required_error: "Password Confirm is required",
        invalid_type_error: "Password must be a string",
    }).min(4, { message: "Must be 6 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }).optional(),
}).superRefine(({ oldPassword, password }, ctx) => {
    if (oldPassword && !password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'New Password',
            path: ['password']
        });
    }
    if (!oldPassword && password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Old Password is required',
            path: ['oldPassword']
        });
    }
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
});

// Profile Schema
export const profileSchema = z.object({
    id: z.string().optional(),
    dateOfBirth: z.coerce.date({
        required_error: "Please select a date",
        invalid_type_error: "That's not a date!",
    }).min(new Date("1900-01-01"), { message: "Too old" }).max(new Date(), { message: "Too young!" }).optional(),
    firstName: z.string({
        required_error: "firstName is required",
        invalid_type_error: "firstName must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    lastName: z.string({
        required_error: "lastName is required",
        invalid_type_error: "lastName must be a string",
    }).min(3, { message: "Must be 3 or more characters long" }).max(64, { message: "Must be 64 or fewer characters long" }),
    workRange: z.number({ required_error: "Work range in meters is required", invalid_type_error: "Work Range must be a number", }).int("Needs to be a whole number").min(0, { message: "Distance should be higher than 0" }).max(50000, { message: "Shoule be less than 50.000 ms" }).optional(),
});