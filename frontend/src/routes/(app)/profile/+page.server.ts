import { handleLoginRedirect } from "$lib/util/helpers";
import { redirect, type Actions, fail } from "@sveltejs/kit";
import { HttpStatusCode } from '$lib/util/statusCode';
import { Collections, type UsersResponse, type ServiceResponse, type AvailabilityResponse, type BillingAddressResponse, type BankAccountResponse, type BankCardResponse, type AddressResponse } from "$lib/pocketbase-types";
import { setError, superValidate } from "sveltekit-superforms/server";
import { avatarSchema, availabilitySchema, servicesprovidedSchema, bankAccountSchema, bankCardSchema, billingAddressSchema, addressSchema, profileSchema, emailSchema, roleSchema, bioSchema, changePasswordSchema } from "$lib/schemas";
import { ACCEPTED_IMAGE_TYPES } from "$lib/constants";

export const load = async (event) => {
    // Server API:
    if (event.locals.pbServer.authStore.isValid) {
        try {
            const id: string = event.locals.pbServer.authStore.model?.id;
            const user = await event.locals.pbServer.collection(Collections.Users).getOne<UsersResponse<{ services: ServiceResponse[]; availabilities: AvailabilityResponse[], billingAddress: BillingAddressResponse, address: AddressResponse, bankAccounts: BankAccountResponse[], bankCards: BankCardResponse[] }>>(id, { "expand": 'services,billingAddress,address,availabilities,bankAccounts,bankCards' });
            const profileForm = await superValidate({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                workRange: user.workRange,
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
            }, profileSchema, { errors: false });
            const changeBioForm = await superValidate({ id: user.id, bio: user.bio }, bioSchema, { errors: false });
            const changeAvatarForm = await superValidate({ id: user.id }, avatarSchema, { errors: false });
            const changeRoleForm = await superValidate({ id: user.id, role: user.role }, roleSchema, { errors: false });
            const changePasswordForm = await superValidate(changePasswordSchema);
            const changeEmailForm = await superValidate(emailSchema);
            const servicesprovidedForm = await superValidate(servicesprovidedSchema);
            const availabilityForm = await superValidate(availabilitySchema);
            const bankAccountForm = await superValidate(bankAccountSchema);
            const bankCardForm = await superValidate(bankCardSchema);
            const billingAddressForm = await superValidate(user.expand?.billingAddress, billingAddressSchema, { errors: false });
            const addressForm = await superValidate(user.expand?.address, addressSchema, { errors: false });
            console.log("Dashboard --> ", user)
            return {
                user,
                changeAvatarForm,
                changeBioForm,
                changePasswordForm,
                changeRoleForm,
                changeEmailForm,
                profileForm,
                servicesprovidedForm,
                availabilityForm,
                bankAccountForm,
                bankCardForm,
                billingAddressForm,
                addressForm
            }
        } catch (e) {
            console.error("profile --> error --> ", e);
            throw redirect(HttpStatusCode.TEMPORARY_REDIRECT, handleLoginRedirect(event))
        }
    } else {
        console.error("profiel --> error --> notLoggedIn");
        throw redirect(HttpStatusCode.TEMPORARY_REDIRECT, handleLoginRedirect(event))
    }

};
export const actions = {
    editprofile: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, profileSchema);

        if (!form.valid) {
            console.log("server edit profile --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {

            await locals.pbServer.collection(Collections.Users).update(form.data.id ?? '', {
                firstName: form.data.firstName,
                lastName: form.data.lastName,
                workRange: form.data.workRange,
                dateOfBirth: form.data.dateOfBirth ? new Date(form.data.dateOfBirth) : undefined,
            });
        } catch (error: any) {
            console.error("Edit profile Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    changemail: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, emailSchema);
        if (!form.valid) {
            console.log("server change email --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.Users).requestEmailChange(form.data.email);
        } catch (error: any) {
            console.error("Edit change email Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    changepassword: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, changePasswordSchema);
        if (!form.valid) {
            console.log("server change password --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.Users).update(form.data.id ?? '', form.data);
        } catch (error: any) {
            console.error("Edit change password Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    editavatar: async ({ locals, request }) => {
        const formData = await request.formData();
        const file = formData.get('avatar') as File | null | undefined
        const form = await superValidate(formData, avatarSchema);
        if (file && file?.size > 0) {
            if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                try {
                    await locals.pbServer.collection(Collections.Users).update(form.data.id ?? '', { 'avatar': file });
                } catch (error: any) {
                    console.log('editavatar error --> ', error);
                    setError(form, 'avatar', error.message);
                    return fail(error.code, {
                        form
                    });
                }
            } else {
                setError(form, 'avatar', "Only .jpg, .jpeg, and .png files are accepted.");
                return fail(HttpStatusCode.BAD_REQUEST, {
                    form
                });
            }
        }
    },
    editbio: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, bioSchema);

        if (!form.valid) {
            console.log("server change bio --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.Users).update(form.data.id ?? '', {
                bio: form.data.bio
            });
        } catch (error: any) {
            console.error("Edit change bio Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, 'bio', error.message);
            return fail(error.code, {
                form
            });
        }
    },
    changerole: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, roleSchema);

        if (!form.valid) {
            console.log("server change role --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {

            await locals.pbServer.collection(Collections.Users).update(form.data.id ?? '', {
                role: form.data.role
            });
        } catch (error: any) {
            console.error("Edit change role Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    newservice: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, servicesprovidedSchema);

        if (!form.valid) {
            console.log("server new Service --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {

            await locals.pbServer.collection(Collections.Service).create({
                hourlyRate: form.data.hourlyRate,
                service: form.data.service
            });
        } catch (error: any) {
            console.error("New Service Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    editservice: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, servicesprovidedSchema);

        if (!form.valid) {
            console.log("server edit Service --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {

            await locals.pbServer.collection(Collections.Service).update(form.data.id ?? '', {
                hourlyRate: form.data.hourlyRate,
                service: form.data.service
            });
        } catch (error: any) {
            console.error("Edit Service Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    deleteservice: async ({ locals, request }) => {
        const data = await request.formData();
        const id = String(data.get('id'));
        if (id) {
            try {
                await locals.pbServer.collection(Collections.Service).delete(id);
                return { success: true };
            } catch (error: any) {
                return fail(400, { id, success: false });
            }
        } else {
            return fail(400, { id, success: false });
        }
    },
    newavailability: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, availabilitySchema);

        if (!form.valid) {
            console.log("server new Availability --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {

            await locals.pbServer.collection(Collections.Availability).create(form.data);
        } catch (error: any) {
            console.error("New Availability Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    editavailability: async ({ locals, request }) => {
        const formData = await request.formData();
        console.log("editAva --> ", String(formData.get('start')));
        const form = await superValidate(formData, availabilitySchema);

        if (!form.valid) {
            console.log("server edit Availability --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.Availability).update(form.data.id ?? '', {
                weekday: form.data.weekday,
                start: form.data.start,
                end: form.data.end,
            });
        } catch (error: any) {
            console.error("Edit Service Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    deleteavailability: async ({ locals, request }) => {
        const data = await request.formData();
        const id = String(data.get('id'));
        if (id) {
            try {
                await locals.pbServer.collection(Collections.Availability).delete(id);
                return { success: true };
            } catch (error: any) {
                return fail(400, { id, success: false });
            }
        } else {
            return fail(400, { id, success: false });
        }
    },
    editbillingaddress: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, billingAddressSchema);

        if (!form.valid) {
            console.log("server new/edit billingaddress --> form invalid--> ", form.errors);
            return fail(400, { form });
        }

        try {
            if (form.data.id == undefined || form.data.id == "") {
                await locals.pbServer.collection(Collections.BillingAddress).create(form.data);
            } else {
                await locals.pbServer.collection(Collections.BillingAddress).update(form.data.id ?? '', form.data);
            }

        } catch (error: any) {
            console.error("new/edit billingaddress Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    editaddress: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, addressSchema);

        if (!form.valid) {
            console.log("server new/edit Address --> form invalid--> ", form.errors);
            return fail(400, { form });
        }

        try {
            console.log("new/edit Address Form --> ", formData);
            if (form.data.id == undefined || form.data.id == "") {
                console.log("new address");
                await locals.pbServer.collection(Collections.Address).create(form.data);
            } else {
                console.log("edit address");
                await locals.pbServer.collection(Collections.Address).update(form.data.id ?? '', form.data);
            }

        } catch (error: any) {
            console.error("new/edit Address Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, 'postCode', error.message);
            return fail(error.code, {
                form
            });
        }
    },
    newbankaccount: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, bankAccountSchema);

        if (!form.valid) {
            console.log("server BankAccount --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {

            await locals.pbServer.collection(Collections.BankAccount).create(form.data);
        } catch (error: any) {
            console.error("New BankAccount Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, 'accountNumber', error.message);
            return fail(error.code, {
                form
            });
        }
    },
    deletebankaccount: async ({ locals, request }) => {
        const data = await request.formData();
        const id = String(data.get('id'));
        if (id) {
            try {
                await locals.pbServer.collection(Collections.BankAccount).delete(id);
                return { success: true };
            } catch (error: any) {
                return fail(400, { id, success: false });
            }
        } else {
            return fail(400, { id, success: false });
        }
    },
    editbankaccount: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, bankAccountSchema);

        if (!form.valid) {
            console.log("server edit bankaccount --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.BankAccount).update(form.data.id ?? '', form.data);
        } catch (error: any) {
            console.error("Edit edit bankaccount Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            return fail(error.code, {
                form
            });
        }
    },
    newbankcard: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, bankCardSchema);

        if (!form.valid) {
            console.log("server BankCard --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.BankCard).create(form.data);
        } catch (error: any) {
            console.error("New BankCard Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, 'cvc', error.message);
            return fail(error.code, {
                form
            });
        }
    },
    editbankcard: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, bankCardSchema);

        if (!form.valid) {
            console.log("server edit BankCard --> form invalid--> ", form.errors);
            return fail(400, { form });
        }
        try {
            await locals.pbServer.collection(Collections.BankCard).update(form.data.id ?? '', form.data);
        } catch (error: any) {
            console.error("Edit edit BankCard Error --> ", error);
            const errorData: {
                [index: string]: { code: string, message: string }
            } = error.response.data;
            for (const [key, value] of Object.entries(errorData)) {
                setError(form, key as keyof typeof form.data, value.message);
            }
            setError(form, 'cvc', error.message);
            return fail(error.code, {
                form
            });
        }
    },
    deletebankcard: async ({ locals, request }) => {
        const data = await request.formData();
        const id = String(data.get('id'));
        if (id) {
            try {
                await locals.pbServer.collection(Collections.BankCard).delete(id);
                return { success: true };
            } catch (error: any) {
                return fail(400, { id, success: false });
            }
        } else {
            return fail(400, { id, success: false });
        }
    },

} satisfies Actions;