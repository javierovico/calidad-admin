import ClaseModelV2 from "./ClaseModelV2";
import Empresa from "./Empresa";
import Sucursal from "./Sucursal";

/**
 * Es un conjunto de EncuestaRespuesta
 */
export default class Horario extends ClaseModelV2 {
    static PRIMARY_KEY = 'id_horario'
    static URL_DESCARGA = `/suc-hora`


    static OBJETOS = [
        'diaStr',
        {key:'dia_sem', porDefecto: 0},
        'horaArray',
        {key:'hora_fin1', porDefecto:'23:59:59'},
        {key:'hora_fin2', porDefecto:'23:59:59'},
        {key:'hora_ini1', porDefecto:'00:00:00'},
        {key:'hora_ini2', porDefecto:'00:00:00'},
        'horarioStr',
        'id_horario',
        'id_sucursal',
        'suc_deriva',
        'suc_deriva_ped',
        'suc_not_out_horario',
    ]
    static INT_TO_DAY = {
        '-1': 'Domingo',
        // 0: 'Domingo',       //el cero no se es reconocido por el select de Swal
        1: 'Lunes',
        2: 'Martes',
        3: 'Miercoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sabado',
    };

    constructor(e) {
        super(e,Horario.OBJETOS,Horario.PRIMARY_KEY,Horario.URL_DESCARGA,false);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Horario.URL_DESCARGA,id)
    }

    getUrlCarga() {
        // console.log(this.exists(),Sucursal.urlCargaFromId(this.id_sucursal),super.getUrlCarga())
        return ((this.exists())?(''):(Sucursal.urlCargaFromId(this.id_sucursal)) )+ super.getUrlCarga();
    }

    static fromSource(e){
        return new Horario(e)
    }

    getPeriodo1(){
        return this.horaArray[0].ini + ' a ' + this.horaArray[0].fin
    }

    getPeriodo2(){
        return (this.horaArray.length > 1)? (this.horaArray[1].ini + ' a ' + this.horaArray[1].fin):''
    }

}