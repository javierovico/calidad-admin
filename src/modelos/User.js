import ClaseModelV2 from './ClaseModelV2';
import RolApi from "./Acceso/RolApi";

export default class User extends ClaseModelV2 {
    static URL_DESCARGA = `/auth/user`;
    static URL_LOGIN = '/auth/login';

    constructor(e, aceptaExtra = false) {
        super(e, [
            'created_at',
            'id',
            'updated_at',
            'user',
        ], 'id', User.URL_DESCARGA, aceptaExtra);
    }

    static fromSource(e) {
        return new User(e);
    }
}
