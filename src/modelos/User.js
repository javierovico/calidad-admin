import ClaseModelV2 from './ClaseModelV2';

export default class User extends ClaseModelV2 {
    static URL_DESCARGA = `/user`;
    static URL_LOGIN = '/auth/login';

    constructor(e, aceptaExtra = false) {
        super(e, [
            'created_at',
            'email',
            'email_verified_at',
            'id',
            'name',
            'rol_id',
            'updated_at',
        ], 'id', User.URL_DESCARGA, aceptaExtra);
    }

    static fromSource(e) {
        return new User(e);
    }
}
