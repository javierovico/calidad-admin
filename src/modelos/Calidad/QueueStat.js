import ClaseModelV3 from "../ClaseModelV3";

export default class QueueStat extends ClaseModelV3{
    static URL_DESCARGA = `/pbx/registro`;

    constructor(atributos) {
        super({atributos});
    }

}