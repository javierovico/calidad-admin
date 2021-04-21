import ClaseModelV2 from "./ClaseModelV2";
import Formula from "./Formula";
import TipoProducto from "./TipoProducto";
import {getDate} from "../utils/Utils";
import Empresa from "./Empresa";
import Sucursal from "./Sucursal";
import Categoria from "./Categoria";
import ProductoCupon from "./ProductoCupon";

/**
 * Es un conjunto de EncuestaRespuesta
 */
export default class Producto extends ClaseModelV2 {
    static PRIMARY_KEY = 'IdProducto'
    static URL_DESCARGA = `/producto`

    static URL_DESCARGA_SABOR = `/sabor`;
    static URL_DESCARGA_OPTION = `/option`;
    static URL_DESCARGA_PRODUCTO_DATA = '/data';
    static ORIGEN_DELIVERY = 'DELI';
    static ORIGEN_JEDI = 'JEDI';
    static NOMBRE_NO_ENCONTRADO = `[no encontrado]`;
    static NOMBRE_MULTIPLE = `[multiples]`;
    static URL_UPDATE_PRODUCTO = `/update-productos`;
    static URL_DESCARGA_PRODUCTOS_BY_CODEPRODUCTO = '/productos-by-codeproducto';
    static URL_UPDATE_PRODUCTO_V2 = `/update-productos-v2`;


    static OBJETOS = [
        {key: 'IdProducto', type: null, porDefecto: null},
        {key: 'codeProducto', type: String, porDefecto: null},
        {key: 'producto', type: null, porDefecto: ''},
        {key: 'precioDeliv', type: null, porDefecto: 0},
        {key: 'precioCarryOut', type: null, porDefecto: 0},
        {key: 'descripcion', type: null, porDefecto: null},
        {key: 'abrev', type: null, porDefecto: ''},
        {key: 'activo', type: null, porDefecto: 1},
        {key: 'servicio', type: null, porDefecto: 0},
        {key: 'stock', type: null, porDefecto: 1},
        {key: 'updateStock', type: null, porDefecto: 0},
        {key: 'imagen', type: null, porDefecto: ''},
        {key: 'fechaAlta', type: null, porDefecto: null},
        {key: 'fechaUpd', type: null, porDefecto: null},
        {key: 'cantidadItems', type: null, porDefecto: 1},
        {key: 'calculo', type: null, porDefecto: Formula.SIN_FORMULA},
        {key: 'IdCategoriaProd', type: null, porDefecto: null},
        {key: 'IdtipoProducto', type: null, porDefecto: TipoProducto.TIPO_SIMPLE},
        {key: 'cantidadRequerida', type: null, porDefecto: 1},
        {key: 'cantidadMaxima', type: null, porDefecto: 0},
        {key: 'vdesdefecha', type: null, porDefecto: getDate(-1)},
        {key: 'vhastafecha', type: null, porDefecto: '2099-12-31'},
        {key: 'id_sucursal', type: null, porDefecto: null},
        {key: 'is_prec_tot', type: null, porDefecto: 0},
        {key: 'dias_venta', type: null, porDefecto: ''},
        {key: 'horas_venta', type: null, porDefecto: ''},
        {key: 'dias_mes_venta', type: null, porDefecto: ''},
        {key: 'grupoarticulo', type: null, porDefecto: ''},
        {key: 'id_acuerdo_desc', type: null, porDefecto: ''},
        {key: 'id_sub_categoria', type: null, porDefecto: 0},
        {key: 'cant_porciones', type: null, porDefecto: 0},
        {key: 'TipoMasa', type: null, porDefecto: -1},
        {key: 'pro_view', type: null, porDefecto: 0},
        {key: 'pro_size', type: null, porDefecto: -1},
        {key: 'forma_pago', type: null, porDefecto: null},
        {key: 'tipo_producto', type: TipoProducto, porDefecto: null},
        {key: 'formula', type: null, porDefecto: null},
        {key: 'categoria', type: Categoria, porDefecto: null},
        {key: 'origen', type: null, porDefecto: Producto.ORIGEN_DELIVERY},
        {key: 'codeCategoria', type: null, porDefecto: null},
        {key: 'categoriaPila', type: Categoria, array: true},
        {key: 'cupones', array: true, type: ProductoCupon},
        {key: 'sabores', array: true, type: Producto},
        {key: 'options', array: true, type: Producto}
    ]

    constructor(e, aceptarExtra = true) {
        super(e, Producto.OBJETOS, Producto.PRIMARY_KEY, Producto.URL_DESCARGA, aceptarExtra);
    }

    static urlCargaFromId(id) {
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Producto.URL_DESCARGA, id)
    }

    static fromSource(e) {
        return new Producto(e)
    }


    isProductoPlataforma() {
        return TipoProducto.isProductoPlataforma(this.IdtipoProducto)
    }

    static urlCargaFromOptionId(id) {
        let url = Producto.URL_DESCARGA_OPTION
        if (id) {
            url += `/${id}`
        }
        return url
    }


    static fromJedi(productoOriginal, j, sucursal_id, categoria_id, codeCategoria) {
        return new Producto({
            IdProducto: productoOriginal ? productoOriginal.IdProducto : null,
            codeProducto: j.IDARTICULO,
            producto: j.articulo,
            precioDeliv: j.calc_precio > 0 ? j.calc_precio : (productoOriginal ? productoOriginal.precioDeliv : 0),
            precioCarryOut: j.calc_precio > 0 ? j.calc_precio : (productoOriginal ? productoOriginal.precioCarryOut : 0),
            descripcion: j.articulo,
            abrev: j.descripcion_corta,
            activo: j.activo ? 1 : 0,
            servicio: 0,
            stock: j.stock ? 1 : 0,
            updateStock: productoOriginal ? productoOriginal.updateStock : 0,
            imagen: productoOriginal ? productoOriginal.imagen : '',
            fechaAlta: productoOriginal ? productoOriginal.fechaAlta : null,
            fechaUpd: productoOriginal ? productoOriginal.fechaUpd : null,
            cantidadItems: productoOriginal ? productoOriginal.cantidadItems : 1,
            calculo: productoOriginal ? productoOriginal.calculo : Formula.SIN_FORMULA,
            IdCategoriaProd: categoria_id ? categoria_id : (productoOriginal ? productoOriginal.IdCategoriaProd : 0),
            IdtipoProducto: j.COMBO ? TipoProducto.TIPO_PROMOCION : TipoProducto.TIPO_SIMPLE,
            cantidadRequerida: productoOriginal ? productoOriginal.cantidadRequerida : 1,
            cantidadMaxima: productoOriginal ? productoOriginal.cantidadMaxima : 0,
            vdesdefecha: productoOriginal ? productoOriginal.vdesdefecha : '2020-01-01',
            vhastafecha: productoOriginal ? productoOriginal.vhastafecha : '2099-12-12',
            id_sucursal: sucursal_id,
            is_prec_tot: productoOriginal ? productoOriginal.is_prec_tot : 0,
            dias_venta: productoOriginal ? productoOriginal.dias_venta : '0,1,2,3,4,5,6',
            horas_venta: productoOriginal ? productoOriginal.horas_venta : '',
            dias_mes_venta: productoOriginal ? productoOriginal.dias_mes_venta : '',
            grupoarticulo: j.grupo,
            id_acuerdo_desc: productoOriginal ? productoOriginal.id_acuerdo_desc : '',
            id_sub_categoria: productoOriginal ? productoOriginal.id_sub_categoria : 0,
            cant_porciones: productoOriginal ? productoOriginal.cant_porciones : 0,
            TipoMasa: productoOriginal ? productoOriginal.TipoMasa : -1,
            pro_view: productoOriginal ? productoOriginal.pro_view : 0,
            pro_size: productoOriginal ? productoOriginal.pro_size : -1,
            forma_pago: productoOriginal ? productoOriginal.forma_pago : null,
            tipo_producto: productoOriginal ? productoOriginal.tipo_producto : null,
            formula: productoOriginal ? productoOriginal.formula : null,
            categoria: productoOriginal ? productoOriginal.categoria : null,
            origen: Producto.ORIGEN_JEDI,
            codeCategoria: codeCategoria,
        })
    }

    static createNoEncontrado(sucursal_id, codeProducto) {
        let productoNoEncontrado = new Producto()
        productoNoEncontrado.codeProducto = codeProducto
        productoNoEncontrado.producto = Producto.NOMBRE_NO_ENCONTRADO
        productoNoEncontrado.activo = 0
        productoNoEncontrado.stock = 0
        productoNoEncontrado.codeProducto = `[no]`
        productoNoEncontrado.precioDeliv = `[invalido]`
        productoNoEncontrado.id_sucursal = sucursal_id
        return productoNoEncontrado
    }

    static createNoValido(sucursal_id, codeProducto) {
        let productoNoEncontrado = new Producto()
        productoNoEncontrado.codeProducto = codeProducto
        productoNoEncontrado.producto = Producto.NOMBRE_MULTIPLE
        productoNoEncontrado.activo = 0
        productoNoEncontrado.stock = 0
        productoNoEncontrado.codeProducto = `[no]`
        productoNoEncontrado.precioDeliv = `[invalido]`
        productoNoEncontrado.id_sucursal = sucursal_id
        return productoNoEncontrado
    }

    isInvalido() {
        return this.producto === Producto.NOMBRE_MULTIPLE
    }

    isNoEncontrado() {
        return this.producto === Producto.NOMBRE_NO_ENCONTRADO
    }

    isFromDelivery() {
        return this.origen === Producto.ORIGEN_DELIVERY
    }

    isCombo() {
        return this.IdtipoProducto === TipoProducto.TIPO_PROMOCION
    }

    getCategoriaFromStore() {
        console.error('ya no esat en react')
        // return this.IdCategoriaProd ?
        //     store.getters.categoriav3_get_categoria_by_id(this.IdCategoriaProd) :
        //     store.getters.categoriav3_get_categoria_by_sucursal_and_code_categoria_v2(this.id_sucursal, this.codeCategoria)
    }

    getUrlCarga() {
        return ((this.exists()) ? '' : (Sucursal.urlCargaFromId(this.id_sucursal) + Categoria.urlCargaFromId(this.IdCategoriaProd))) + super.getUrlCarga()
    }

    resolveCodeProducto() {
        return (this.codeProducto && this.codeProducto !== "0") ? this.codeProducto : ('id_' + this.IdProducto)
    }

    muestraSabor(){
        return ([TipoProducto.TIPO_COMPUESTO,/* TipoProducto.TIPO_PROMOCION*/].indexOf(this.IdtipoProducto)) >= 0
    }


    muestraCupon(){
        return ([TipoProducto.TIPO_PROMOCION].indexOf(this.IdtipoProducto)) >= 0
    }

}