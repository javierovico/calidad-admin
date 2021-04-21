import ClaseModel from "./ClaseModel";

export default class Cliente extends ClaseModel{
    IdCliente
    IdPersona
    id_cte_deliv
    id_dir_cte_deliv
    id_sucursal
    id_usuario
    nombre
    apellidos
    calle
    altura
    apartamento
    entre_calle1
    entre_calle2
    barrio
    localidad
    ciudad
    latitud
    longitud
    zona_critica
    dni
    telefono
    telefono1
    movil
    movil1
    email
    fecha_nac
    fecha_alta
    SucursalAlta
    sexo
    observaciones
    factura
    dpto_pais
    id_domicilio
    documento
    ruc
    email3
    obs
    estado
    id_tipo_docus
    id_cate_clientes
    departamento
    es_principal
    cadena_datos

    //estaticas
    // `delivery/${empresa_id}/motivo?XDEBUG_SESSION_START=PHPSTORM`
    static URL_DESCARGA = `/cliente`

    constructor(
        IdCliente = null,
        IdPersona = null,
        id_cte_deliv = null,
        id_dir_cte_deliv = null,
        id_sucursal = null,
        id_usuario = null,
        nombre = null,
        apellidos = null,
        calle = null,
        altura = null,
        apartamento = null,
        entre_calle1 = null,
        entre_calle2 = null,
        barrio = null,
        localidad = null,
        ciudad = null,
        latitud = null,
        longitud = null,
        zona_critica = null,
        dni = null,
        telefono = null,
        telefono1 = null,
        movil = null,
        movil1 = null,
        email = null,
        fecha_nac = null,
        fecha_alta = null,
        SucursalAlta = null,
        sexo = null,
        observaciones = null,
        factura = null,
        dpto_pais = null,
        id_domicilio = null,
        documento = null,
        ruc = null,
        email3 = null,
        obs = null,
        estado = null,
        id_tipo_docus = null,
        id_cate_clientes = null,
        departamento = null,
        es_principal = null,
        cadena_datos = null,
    ) {
        super()
        this.IdCliente = IdCliente
        this.IdPersona = IdPersona
        this.id_cte_deliv = id_cte_deliv
        this.id_dir_cte_deliv = id_dir_cte_deliv
        this.id_sucursal = id_sucursal
        this.id_usuario = id_usuario
        this.nombre = nombre
        this.apellidos = apellidos
        this.calle = calle
        this.altura = altura
        this.apartamento = apartamento
        this.entre_calle1 = entre_calle1
        this.entre_calle2 = entre_calle2
        this.barrio = barrio
        this.localidad = localidad
        this.ciudad = ciudad
        this.latitud = latitud
        this.longitud = longitud
        this.zona_critica = zona_critica
        this.dni = dni
        this.telefono = telefono
        this.telefono1 = telefono1
        this.movil = movil
        this.movil1 = movil1
        this.email = email
        this.fecha_nac = fecha_nac
        this.fecha_alta = fecha_alta
        this.SucursalAlta = SucursalAlta
        this.sexo = sexo
        this.observaciones = observaciones
        this.factura = factura
        this.dpto_pais = dpto_pais
        this.id_domicilio = id_domicilio
        this.documento = documento
        this.ruc = ruc
        this.email3 = email3
        this.obs = obs
        this.estado = estado
        this.id_tipo_docus = id_tipo_docus
        this.id_cate_clientes = id_cate_clientes
        this.departamento = departamento
        this.es_principal = es_principal
        this.cadena_datos = cadena_datos
    }



    exists(){
        return this.IdCliente && this.IdCliente > 0
    }

    getUrlCarga(){
        let url = `/cliente`
        if(this.exists()){
            url += `/${this.IdCliente}`
        }
        return url
    }

    static fromSource(e){
        return new Cliente(
            e.IdCliente,
            e.IdPersona,
            e.id_cte_deliv,
            e.id_dir_cte_deliv,
            e.id_sucursal,
            e.id_usuario,
            e.nombre,
            e.apellidos,
            e.calle,
            e.altura,
            e.apartamento,
            e.entre_calle1,
            e.entre_calle2,
            e.barrio,
            e.localidad,
            e.ciudad,
            e.latitud,
            e.longitud,
            e.zona_critica,
            e.dni,
            e.telefono,
            e.telefono1,
            e.movil,
            e.movil1,
            e.email,
            e.fecha_nac,
            e.fecha_alta,
            e.SucursalAlta,
            e.sexo,
            e.observaciones,
            e.factura,
            e.dpto_pais,
            e.id_domicilio,
            e.documento,
            e.ruc,
            e.email3,
            e.obs,
            e.estado,
            e.id_tipo_docus,
            e.id_cate_clientes,
            e.departamento,
            e.es_principal,
            e.cadena_datos,
        )
    }
}