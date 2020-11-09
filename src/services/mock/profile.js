const BASE_URL = process.env.VUE_APP_API_BASE_URL
import {
    request
} from '@/utils/request'

export const getFilter = async () => {
    return request(`${BASE_URL}/profile/getFilter`, 'get');
}