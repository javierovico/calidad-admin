import ClaseModelV2 from '../ClaseModelV2';
import PermisoApi from "./Permiso";

export default class RolApi extends ClaseModelV2 {
    static URL_DESCARGA = `/x`;

    constructor(e, aceptaExtra = false) {
        super(e, [
            {key: 'codigo'},
            {key: 'created_at'},
            {key: 'descripcion'},
            {key: 'id'},
            {key: 'permisos', array:true, type: PermisoApi},
            {key: 'pivot', hijos:[
                'empresa_id','usuario_id','rol_id',
            ]},
            {key: 'updated_at'},
        ], 'id', RolApi.URL_DESCARGA, aceptaExtra);
    }

    static fromSource(e) {
        return new RolApi(e);
    }
}