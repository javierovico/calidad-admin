import ClaseModelV3 from "../ClaseModelV3";

export default class Evento extends ClaseModelV3{
    static URL_DESCARGA = `/pbx/setup`;

    static EVENT_LIST_KEY = {
        '1':'ABANDON',
        '2':'ADDMEMBER',
        '3':'AGENTCALLBACKLOGIN',
        '4':'AGENTCALLBACKLOGOFF',
        '5':'AGENTDUMP',
        '6':'AGENTLOGIN',
        '7':'AGENTLOGOFF',
        '8':'AGENTPAUSED',
        '9':'COMPLETEAGENT',
        '10':'COMPLETECALLER',
        '11':'CONFIGRELOAD',
        '12':'CONNECT',
        '13':'CONNECTED',
        '14':'DID',
        '15':'ENTERQUEUE',
        '16':'EXITEMPTY',
        '17':'EXITWITHKEY',
        '18':'EXITWITHTIMEOUT',
        '19':'NONE',
        '20':'PAUSE',
        '21':'PAUSEALL',
        '22':'PAUSECUSTOM',
        '23':'QUEUESTART',
        '24':'REMOVEMEMBER',
        '25':'RINGNOANSWER',
        '26':'TRANSFER',
        '27':'UNPAUSE',
        '28':'UNPAUSEALL',
        '29':'SYSCOMPAT',
    }

    static ABANDON = 1;
    static ADDMEMBER = 2;
    static AGENTCALLBACKLOGIN = 3;
    static AGENTCALLBACKLOGOFF = 4;
    static AGENTDUMP = 5;
    static AGENTLOGIN = 6;            //login?
    static AGENTLOGOFF = 7;           //logout?
    static AGENTPAUSED = 8;
    static COMPLETEAGENT = 9;         //si la llamada finalizo
    static COMPLETECALLER = 10;       //si la llamada finalizo
    static CONFIGRELOAD = 11;
    static CONNECT = 12;
    static CONNECTED = 13;
    static DID = 14;
    static ENTERQUEUE = 15;
    static EXITEMPTY = 16;
    static EXITWITHKEY = 17;
    static EXITWITHTIMEOUT = 18;
    static NONE = 19;
    static PAUSE = 20;
    static PAUSEALL = 21;
    static PAUSECUSTOM = 22;
    static QUEUESTART = 23;
    static REMOVEMEMBER = 24;
    static RINGNOANSWER = 25;
    static TRANSFER = 26;             //se transfirio la llamada
    static UNPAUSE = 27;
    static UNPAUSEALL = 28;
    static SYSCOMPAT = 29;
    static ARRAY_EVENTO_LLAMADAS_RECIBIDAS = [Evento.COMPLETEAGENT,Evento.COMPLETECALLER,Evento.TRANSFER,];
    static ARRAY_EVENTO_LLAMADAS_FINALIZADAS = [Evento.COMPLETEAGENT,Evento.COMPLETECALLER,];
    static ARRAY_EVENTO_PAUSAS = [Evento.UNPAUSEALL,Evento.PAUSEALL,Evento.UNPAUSE,Evento.PAUSE];
    static ARRAY_EVENTO_PAUSADO = [Evento.PAUSEALL,Evento.PAUSE];


    constructor(atributos) {
        super({atributos});
    }

    static getEventNameById(id){
        if (id in Evento.EVENT_LIST_KEY){
            return Evento.EVENT_LIST_KEY[id]
        }else{
            return 'UNKNOWN'
        }
    }

}