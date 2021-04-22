import {useLocation} from "./useLocation";
import {useEffect, useReducer} from "react";
import {useDeepCompareEffect} from "react-use";
export function getUrl(location) {
    // const location = location;
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
                // case 'text':
                //   state[key] =
                //     urlData[key] && urlData[key] !== 'null' ? urlData[key] : '';
                //   break;
                // case 'categories':
                //   state[key] =
                //     urlData[key] && urlData[key] !== 'null'
                //       ? urlData[key].split(',')
                //       : [];
                //   break;

                case 'date_range':
                    const date = urlData[key] ? urlData[key] : null;
                    if (date) {
                        let splitDate = date ? date.split(',') : null;
                        let setStartDate = splitDate ? splitDate[0] : null;
                        let setEndDate = splitDate ? splitDate[1] : null;
                        state[key] = date
                            ? {setStartDate: setStartDate, setEndDate: setEndDate}
                            : null;
                    }
                    break;

                case 'amenities':
                case 'servicios':
                case 'filtros':
                case 'actividades':
                    state[key] =
                        urlData[key] && urlData[key] !== 'null'
                            ? urlData[key].split(',')
                            : [];
                    break;
                // case 'departamentos':
                //     state[key] =
                //         urlData[key] && urlData[key] !== 'null'
                //             ? urlData[key].split(',')
                //             : [];
                //     break;

                case 'room':
                    if (urlData[key]) {
                        state[key] = urlData[key] ? urlData[key] : 0;
                    } else {
                        state[key] = '';
                    }

                    break;

                case 'guest':
                    if (urlData[key]) {
                        state[key] = urlData[key] ? urlData[key] : 0;
                    } else {
                        state[key] = '';
                    }
                    break;

                case 'property':
                    state[key] =
                        urlData[key] && urlData[key] !== 'null'
                            ? urlData[key].split(',')
                            : [];
                    break;

                case 'price':
                    const defaultPrice = {
                        min: 0,
                        max: 100,
                        defaultMin: 0,
                        defaultMax: 100,
                    };
                    const price = urlData[key] ? urlData[key].split(',') : defaultPrice;
                    if (price) {
                        let min, max;
                        min = price ? Number(price[0]) : 0;
                        max = price ? Number(price[1]) : 100;
                        if (min > 0 || max < 100) {
                            state[key] = {
                                min: min,
                                max: max,
                                defaultMin: 0,
                                defaultMax: 100,
                            };
                        } else {
                            state[key] = '';
                        }
                    }
                    break;

                // case 'radius':
                //   state[key] = Number(urlData[key]);
                //   break;

                // case 'condition':
                //   state[key] = urlData[key] && urlData[key] == 'true' ? true : false;
                //   break;

                // case 'isNegotiable':
                //   state[key] = urlData[key] && urlData[key] == 'true' ? true : false;
                //   break;

                case 'location_lat':
                    if (urlData['location_lat']) {
                        state['location'] = {};
                        state['location']['lat'] = Number(urlData[key]);
                    } else {
                        state['location'] = null;
                    }
                    break;

                case 'location_lng':
                    if (urlData[key]) {
                        state['location']['lng'] = Number(urlData[key]);
                    }
                    break;

                // case 'sorting_field':
                //   if (urlData[key]) {
                //     state['sorting'] = {};
                //     state['sorting']['field'] = urlData[key];
                //   }
                //   break;

                // case 'sorting_type':
                //   if (urlData[key]) {
                //     state['sorting']['type'] = urlData[key];
                //   }
                //   break;

                case 'page':
                    if (urlData[key]) {
                        state['page'] = Number(urlData[key]);
                    }
                    break;

                case 'limit':
                    if (urlData[key]) {
                        state['limit'] = Number(urlData[key]);
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
        case 'setDepartamento':
            return (state.departamento !== action.payload)
                ? {
                    ...state,
                    departamento: action.payload
                } :
                state
        case 'setCiudad':
            return (state.ciudad !== action.payload)
                ? {
                    ...state,
                    ciudad: action.payload
                } :
                state
        case 'setServicios':
            /** para aplicar el cambio los estados deben tener diferentes longitudes o enter algunas diferencias en los items*/
            return ((state.servicios.length !== action.payload.length) || (state.servicios.some(i => !action.payload.find(i2 => i2 === i))))
                ? {
                    ...state,
                    servicios: action.payload
                } :
                state
        case 'setActividades':
            /** para aplicar el cambio los estados deben tener diferentes longitudes o enter algunas diferencias en los items*/
            return ((state.actividades.length !== action.payload.length) || (state.actividades.some(i => !action.payload.find(i2 => i2 === i))))
                ? {
                    ...state,
                    actividades: action.payload
                } :
                state
        case 'setFiltros':
            /** para aplicar el cambio los estados deben tener diferentes longitudes o enter algunas diferencias en los items*/
            return ((state.filtros.length !== action.payload.length) || (state.filtros.some(i => !action.payload.find(i2 => i2 === i))))
                ? {
                    ...state,
                    filtros: action.payload
                } :
                state
        case 'empresa_id':
            return {...state, empresa_id: action.payload}
        case 'sucursal_id':
            return {...state, sucursal_id: action.payload}
        default:
            throw new Error('anarako')
    }
}

export const useQueryParams = () => {
    const location = useLocation()
    const stateRaw = getStateFromUrl(location)
    const [state, dispatch] = useReducer(reducer, {
        sucursal_id: parseInt(stateRaw.sucursal_id) || null,
        empresa_id: parseInt(stateRaw.empresa_id) || null,
        departamento: stateRaw.departamento || null,
        ciudad: stateRaw.ciudad || null,
        servicios: stateRaw.servicios || [],
        actividades: stateRaw.actividades || [],
        filtros: stateRaw.filtros || [],
        amenities: stateRaw.amenities || [],
        property: stateRaw.property || [],
        date_range: stateRaw.date_range || {
            setStartDate: null,
            setEndDate: null,
        },
        price: stateRaw.price || {
            min: 0,
            max: 100,
            defaultMin: 0,
            defaultMax: 100,
        },
        location: stateRaw.location || {
            lat: null,
            lng: null,
        },
        room: parseInt(stateRaw.room) || 0,
        guest: parseInt(stateRaw.guest) || 0,
    });
    /** escuchar cambios en departamentos */
    useEffect(() => {
        dispatch({type: 'setDepartamento', payload: stateRaw.departamento || null})
    }, [stateRaw.departamento])
    /** escuchar cambios en ciudades */
    useEffect(() => {
        dispatch({type: 'setCiudad', payload: stateRaw.ciudad || null})
    }, [stateRaw.ciudad])
    /** escuchar cambios en servicios */
    useEffect(() => {
        dispatch({type: 'setServicios', payload: stateRaw.servicios || []})
    }, [stateRaw.servicios])
    /** escuchar cambios en actividades */
    useEffect(() => {
        dispatch({type: 'setActividades', payload: stateRaw.actividades || []})
    }, [stateRaw.actividades])
    /** escuchar cambios en filtros */
    useEffect(() => {
        dispatch({type: 'setFiltros', payload: stateRaw.filtros || []})
    }, [stateRaw.filtros])
    /** escuchar empresa */
    useEffect(()=>{
        dispatch({type:'empresa_id', payload: parseInt(stateRaw.empresa_id) || null})
    },[stateRaw.empresa_id])
    /** escuchar empresa */
    useEffect(()=>{
        dispatch({type:'sucursal_id', payload: parseInt(stateRaw.sucursal_id) || null})
    },[stateRaw.sucursal_id])
    return state
    // return getStateFromUrl(location)
}