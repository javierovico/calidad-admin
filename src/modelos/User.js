import ClaseModelV3 from './ClaseModelV3';

export default class User extends ClaseModelV3 {
    static URL_DESCARGA = `/auth/user`;
    static URL_LOGIN = '/auth/login';

    constructor(atributos) {
        super({atributos});
    }

}
