import {useLocation} from "./useLocation";
import {useEffect, useReducer} from "react";

export function getUrl(location) {
    const data =
        process.browser && location.search
            ? location.search.slice(location.search.indexOf('?') + 1).split('&')
            : [];
    const urlData = {};
    data.forEach(data => {
        try {
            data = data.split('=');
            const dataVal = decodeURIComponent(data[1]);
            urlData[data[0]] = dataVal;
        } catch (e) {
        }
    });
    return urlData;
}

export function getStateFromUrl(location) {
    const urlData = getUrl(location);
    const state = {};
    for (const key in urlData) {
        if (urlData.hasOwnProperty(key)) {
            switch (key) {
                case 'page':
                case 'perPage':
                    if (urlData[key]) {
                        state[key] = Number(urlData[key]);
                    }
                    break;
                default:
                    state[key] = urlData[key];
                    break;
            }
        }
    }
    return state;
}


function reducer(state, action) {
    switch (action.type) {
        case 'page':
        case 'perPage':
            return {...state,[action.type]:action.payload}
        default:
            throw new Error('anarako')
    }
}

export const useQueryParams = () => {
    const location = useLocation()
    const stateRaw = getStateFromUrl(location)
    const [state, dispatch] = useReducer(reducer, {
        page: parseInt(stateRaw.page) || 1,
        perPage: parseInt(stateRaw.perPage) || 10,
    });
    /** escuchar cambios en departamentos */
    useEffect(() => {
        dispatch({type: 'page', payload: stateRaw.page || 1})
    }, [stateRaw.page])
    useEffect(() => {
        dispatch({type: 'perPage', payload: stateRaw.perPage || 10})
    }, [stateRaw.perPage])
    return state
}


export function setStateToUrl(state) {
    let urlData = {};
    for (const key in state) {
        if (state.hasOwnProperty(key)) {
            switch (key) {
                case 'page':
                    urlData[key] = state[key] > 1? state[key] : null;
                    break;
                case 'perPage':
                    urlData[key] = state[key] !== 10? state[key] : null;
                    break;
                default:
                    urlData[key] = state[key];
                    break;
            }
        }
    }
    return createUrl(urlData);
}

export function createUrl(urlData) {
    const keys = Object.keys(urlData);
    let search = '?';
    keys.forEach(key => {
        if (urlData[key] !== null && urlData[key] !== '') {
            search += `${key}=${urlData[key]}&`;
        }
    });
    return search.substring(0, search.length - 1);
}
