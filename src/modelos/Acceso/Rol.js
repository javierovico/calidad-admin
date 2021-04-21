import ClaseModelV2 from '../ClaseModelV2';

export default class Rol extends ClaseModelV2 {
    static URL_DESCARGA = `/x`;

    constructor(e, aceptaExtra = false) {
        super(e, [
            'IdGroupRol',
            'IdRol',
            'descripcion',
            'estado',
            'idDelivery',
            'id_plataforma',
            'rol',
        ], 'IdRol', Rol.URL_DESCARGA, aceptaExtra);
    }

    static fromSource(e) {
        return new Rol(e);
    }
}