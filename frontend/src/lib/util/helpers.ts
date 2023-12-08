
import type { RequestEvent } from "@sveltejs/kit"
import { HttpStatusCode } from '$lib/util/statusCode';
import type { ServiceResponse } from "$lib/pocketbase-types";

export function handleLoginRedirect(
    event: RequestEvent,
    message = "You must be logged in to access this page"
) {
    const redirectTo = event.url.pathname + event.url.search
    return `/login?redirectTo=${redirectTo}&message=${message}`
}
export function handleRedirectAsResponse(status = HttpStatusCode.PERMANENT_REDIRECT, location = "login") {
    return new Response(null, {
        status,
        headers: { location: `/${location}` }
    });
}

export function handleLoginRedirectAsResponse(status = HttpStatusCode.PERMANENT_REDIRECT, event: RequestEvent, location = "login",
    message = "You must be logged in to access this page") {
    const redirectTo = event.url.pathname + event.url.search
    const loc = `/${location}?redirectTo=${redirectTo}&message=${message}`
    return new Response(null, {
        status,
        headers: { location: loc }
    });
}

export function convertTimeToMinutes(time: string | null) {
    if (!time) return null;
    if (!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?((AM)?|(PM))?$/.test(time))) {
        return null;
    }
    const timeParts = time.split(':');
    return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + (time.includes('PM') ? 12 * 60 : 0)
}
export function convertTo12Hour(minutes: number) {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return hours + ':' + (mins < 10 ? '0' + mins : mins) + ' ' + ampm;
}
export function convertTo24Hour(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return (hours < 10 ? '0' + hours : hours) + ':' + (mins < 10 ? '0' + mins : mins);
}
export function findLowestPayPerHour(services: ServiceResponse[], currency: any) {
    if (services.length <= 0) {
        return 'Not Available';
    }
    let minhourlyRate = services[0].hourlyRate;
    for (let index = 0; index < services.length; index++) {
        minhourlyRate =
            minhourlyRate < services[index].hourlyRate ? minhourlyRate : services[index].hourlyRate;
    }

    return `${minhourlyRate} ${currency}/hr`;
}
export function calculateAge(birthdate: string) {
    // Parse the birthdate string into a Date object
    const birthDate = new Date(birthdate);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in years and months
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();

    // Adjust for negative months (when the current month is earlier than the birth month)
    if (months < 0) {
        years--;
        months += 12;
    }

    // Return the age as an object

    return isNaN(years) ? 'Missing' : `${years} years`;
}

export function covertToWorkWeekday(weekday: string) {
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    /* let weekdayStr = "";
    if (weekday == 0) {
        weekdayStr = "Monday"
    } else if (weekday == 1) {
        weekdayStr = "Tuesday"
    } else if (weekday == 2) {
        weekdayStr = "Wednesday"
    } else if (weekday == 3) {
        weekdayStr = "Thursday"
    } else if (weekday == 4) {
        weekdayStr = "Friday"
    } else if (weekday == 5) {
        weekdayStr = "Saturday"
    } else if (weekday == 6) {
        weekdayStr = "Sunday"
    } else {
        weekdayStr = "Everyday"
    }
    return weekdayStr; */
}
export function covertToMonth(month: number) {
    if (month == 1) {
        return "January"
    } else if (month == 2) {
        return "February"
    } else if (month == 3) {
        return "March"
    } else if (month == 4) {
        return "April"
    } else if (month == 5) {
        return "May"
    } else if (month == 6) {
        return "June"
    } else if (month == 7) {
        return "July"
    } else if (month == 8) {
        return "August"
    } else if (month == 9) {
        return "Sepetember"
    } else if (month == 10) {
        return "October"
    } else if (month == 11) {
        return "November"
    } else if (month == 12) {
        return "December"
    } else {
        return "Error"
    }
}