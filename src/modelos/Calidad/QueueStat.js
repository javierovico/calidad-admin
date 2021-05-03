import ClaseModelV3 from "../ClaseModelV3";
import Evento from "./Evento";

export default class QueueStat extends ClaseModelV3{
    static URL_DESCARGA = `/pbx/registro`;

    constructor(atributos) {
        super({
            atributos,
            metodos:{
                getDurationAttribute: function (item){
                    return parseInt((item.qevent !== Evento.TRANSFER && item.info1 < 10000000)?item.info2 : (new Date(item.datetime).getTime() - new Date(item.completecaller.datetime).getTime())/1000);
                }
            }
        });
    }

}