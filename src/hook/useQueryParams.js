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
                case 'telefonosPersonaId':
                    if (urlData[key]) {
                        state[key] = Number(urlData[key]);
                    }
                    break;
                case 'documento':
                    if (urlData[key]) {
                        state[key] = urlData[key];
                    }
                    break;
                case 'listaTipoDoc':
                    state[key] =
                        urlData[key] && urlData[key] !== 'null'
                            ? urlData[key].split(',')
                            : [];
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
        case 'telefonosPersonaId':
        case 'documento':
            return {...state,[action.type]:action.payload}
        case 'listaTipoDoc':
            return ((state[action.type].length !== action.payload.length) || (state[action.type].some(i => !action.payload.find(i2 => i2 === i))))
                ? {
                    ...state,
                    [action.type]: action.payload
                } :
                state
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
        telefonosPersonaId: parseInt(stateRaw.telefonosPersonaId) || 0,
        listaTipoDoc: stateRaw.listaTipoDoc || [],
        documento: stateRaw.documento || '',
    });
    /** escuchar cambios en departamentos */
    useEffect(() => {
        dispatch({type: 'page', payload: stateRaw.page || 1})
    }, [stateRaw.page])
    useEffect(() => {
        dispatch({type: 'perPage', payload: stateRaw.perPage || 10})
    }, [stateRaw.perPage])
    useEffect(() => {
        dispatch({type: 'telefonosPersonaId', payload: stateRaw.telefonosPersonaId || 0})
    }, [stateRaw.telefonosPersonaId])
    useEffect(() => {
        dispatch({type: 'listaTipoDoc', payload: stateRaw.listaTipoDoc || []})
    }, [stateRaw.listaTipoDoc])
    useEffect(() => {
        dispatch({type: 'documento', payload: stateRaw.documento || ''})
    }, [stateRaw.documento])
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
                case 'telefonosPersonaId':
                    urlData[key] = state[key]? state[key] : null;
                    break;
                case 'listaTipoDoc':
                    urlData[key] =
                        state[key] && state[key].length ? state[key].join(',') : null;
                    break;
                case 'documento':
                    urlData[key] = state[key]? state[key] : null;
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
