import { Collections, type AvailabilityResponse, type ProfileResponse, type ServiceResponse } from "$lib/pocketbase-types";
import { convertTimeToMinutes } from "$lib/util/helpers.js";
/**
 * Filter for List, create from the url search params
 * eg: services.service?="BABYSITTER" || services.service?="GARDENER"
 * eg: availabilities.weekday?="EVERYDAY" || availabilities.weekday?="SUNDAY"
 * eg: availabilities.start?>=convertToMins("23:19") || availabilities.end?<=convertToMins("20:20")"
 * eg: services.hourlyRate?>7
 */
function createFilterString(searchParams: URLSearchParams) {
    /* 
    'servicesTypes' => 'CHAT,GARDENER,DRIVEWAYCLEAN,BABYSITTER',
    'serviceWeekday' => 'EVERYDAY',
    'serviceEndTime' => '23:19',
    'serviceStartTime' => '20:20',
    'payRangeMax' => '7',
    'search' => 'name or service or type or location'
    */
    // Server API:
    console.log("url --> ", searchParams)
    let filter = '';
    const services = searchParams.get("servicesTypes") ? searchParams.get("servicesTypes")!.split(',') : []
    let types = '';
    for (let i = 0; i < services.length; i++) {
        if (i == 0) {
            types = 'services.service?="' + services[i] + '"';
        } else {
            types += '|| services.service?="' + services[i] + '"';
        }
    }
    const search = searchParams.get("search")
    const serviceWeekday = searchParams.get("serviceWeekday")
    const serviceStartTime = convertTimeToMinutes(searchParams.get("serviceStartTime"))
    const serviceEndTime = convertTimeToMinutes(searchParams.get("serviceEndTime"))
    const payRangeMax = searchParams.get("payRangeMax")

    filter += search ? `${filter.length > 0 ? "&&" : ""}(fullName~"${search}"||firstName~"${search}"||lastName~"${search}"||username~"${search}"||email~"${search}"||address.formattedAddress?~"${search}")` : "";
    filter += types ? `${filter.length > 0 ? "&&" : ""}(${types})` : "";
    filter += serviceWeekday != null && serviceWeekday !== "EVERYDAY" ? `${filter.length > 0 ? "&&" : ""}(availabilities.weekday?="${serviceWeekday}"||availabilities.weekday?="EVERYDAY")` : "";
    filter += payRangeMax ? `${filter.length > 0 ? "&&" : ""}(services.hourlyRate?<=${payRangeMax})` : "";
    filter += serviceStartTime ? `${filter.length > 0 ? "&&" : ""}(availabilities.start?>=${serviceStartTime})` : "";
    filter += serviceEndTime ? `${filter.length > 0 ? "&&" : ""}(availabilities.end?<=${serviceEndTime})` : "";
    return filter;
}
export const load = async ({ locals, url }) => {

    try {
        //<ProfileResponse<{ services: ServiceResponse[]; availabilities: AvailabilityResponse[] }>>
        const filter = createFilterString(url.searchParams);
        //const sort = url.searchParams.get("sort") ?? null
        const page = url.searchParams.get("page") ? parseInt(url.searchParams.get("page")!) : 1
        /* 'page' => '1',
        'sort' => 'dateDesc' */
        const result = await locals.pbServer.collection(Collections.Profile).getList<ProfileResponse<{ services: ServiceResponse[]; availabilities: AvailabilityResponse[] }>>(page, 15, {
            "expand": 'services,availabilities',
            "filter": filter
        });
        return {
            total: result.totalItems,
            pages: result.totalPages,
            page: result.page,
            perPage: result.perPage,
            sitters: result.items
        }
    } catch (e) {
        /* const res: ProfileResponse[] = []; */
        return {
            total: 0,
            pages: 0,
            page: 0,
            perPage: 0,
            sitters: []
        }
    }
};