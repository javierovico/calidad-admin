import ClaseModelV2 from '../ClaseModelV2';

export default class PermisoApi extends ClaseModelV2 {
    static URL_DESCARGA = `/x`;

    constructor(e, aceptaExtra = false) {
        super(e, [
            'codigo',
            'created_at',
            'updated_at',
            'descripcion',
            'id',
        ], 'id', PermisoApi.URL_DESCARGA, aceptaExtra);
    }

    static fromSource(e) {
        return new PermisoApi(e);
    }
}
