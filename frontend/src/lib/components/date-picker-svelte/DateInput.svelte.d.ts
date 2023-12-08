/* eslint-disable @typescript-eslint/ban-types */
import { SvelteComponentTyped } from "svelte";
import type { Locale } from './locale.js';
declare const __propDef: {
    props: {
        /** Date value */ value?: Date | null | undefined;
        /** The earliest value the user can select */ min?: Date | undefined;
        /** The latest value the user can select */ max?: Date | undefined;
        /** Placeholder text to show when input field is empty */ placeholder?: string | undefined;
        /** Whether the text is valid */ valid?: boolean | undefined;
        /** Disable the input **/ disabled?: boolean | undefined;
        /** Pass custom classes */ class?: string | undefined;
        /** Format string */ format?: string | undefined;
        /** Locale object for internationalization */ locale?: Locale | undefined;
        text?: string | undefined;
        name?: string | undefined;
        id?: string | undefined;
        /** Whether the date popup is visible */ visible?: boolean | undefined;
        /** Close the date popup when a date is selected */ closeOnSelection?: boolean | undefined;
        /** Wait with updating the date until a date is selected */ browseWithoutSelecting?: boolean | undefined;
    };
    events: {
        select: CustomEvent<undefined>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type DateInputProps = typeof __propDef.props;
export type DateInputEvents = typeof __propDef.events;
export type DateInputSlots = typeof __propDef.slots;
export default class DateInput extends SvelteComponentTyped<DateInputProps, DateInputEvents, DateInputSlots> {
}
export { };
