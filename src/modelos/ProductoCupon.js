import ClaseModelV2 from "./ClaseModelV2";
import Formula from "./Formula";
import ProductoTipoCupon from "./ProductoTipoCupon";
import Producto from "./Producto";


export default class ProductoCupon extends ClaseModelV2 {
    static PRIMARY_KEY = 'IdCuponProducto'
    static URL_DESCARGA = `/producto-cupon`


    constructor(e,aceptaExtra = true) {
        super(e, [
            {key: 'IdCuponProducto', porDefecto: null},
            {key: 'descripcion', porDefecto: ''},
            {key: 'cantidadRequerida', porDefecto: 1},
            {key: 'cantidadMaxima', porDefecto: 1},
            {key: 'precioMinimo', porDefecto: 0},
            {key: 'includeOption', porDefecto: 0},
            {key: 'cantidadOption', porDefecto: 0},
            {key: 'IdProducto', porDefecto: null},
            {key: 'pro_view', porDefecto: 0},
            {key: 'cantidadItems', porDefecto: 1},
            {key: 'idTipoCupon', porDefecto: ProductoTipoCupon.TIPO_LISTA_INPUT},
            {key: 'cant_porciones', porDefecto: 0},
            {key: 'calculo', porDefecto: Formula.SIN_FORMULA},
            {key: 'precio', porDefecto: 0},
            {key: 'descuento', porDefecto: 0},
            {key: 'pro_size', porDefecto: 0},
            {key: 'descuento_valor', porDefecto: 0},
            {key: 'codeProducto', porDefecto: null},
            {key: 'sucursal_id', porDefecto: null},
            {key: 'codeProductos', array: true},
            {key: 'productos', type: Producto, array: true},
            {key: 'producto_items', type: Producto, array: true},   //aparentemente es el mismo qeu el de arriba, pero este viene de la bd
        ], ProductoCupon.PRIMARY_KEY, ProductoCupon.URL_DESCARGA, aceptaExtra);
    }

    static urlCargaFromId(id) {
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(ProductoCupon.URL_DESCARGA, id)
    }

    static fromSource(e) {
        return new ProductoCupon(e)
    }


    static fromJediCombo(comboDelivery, combo) {
        return new ProductoCupon({
            IdCuponProducto: comboDelivery ? comboDelivery.IdCuponProducto : null,
            descripcion: combo.definicionPromo,
            cantidadRequerida: comboDelivery ? comboDelivery.cantidadRequerida : -1,
            cantidadMaxima: comboDelivery ? comboDelivery.cantidadMaxima : 0,
            precioMinimo: comboDelivery ? comboDelivery.precioMinimo : 0,
            includeOption: comboDelivery ? comboDelivery.includeOption : 0,
            cantidadOption: comboDelivery ? comboDelivery.cantidadOption : 0,
            IdProducto: comboDelivery ? comboDelivery.IdProducto : null,
            pro_view: comboDelivery ? comboDelivery.pro_view : 0,
            cantidadItems: combo.cantidad,
            idTipoCupon: comboDelivery ? comboDelivery.IdTipoCupon : ProductoTipoCupon.TIPO_LISTA_CHECK,
            cant_porciones: comboDelivery ? comboDelivery.cant_porciones : 0,
            calculo: comboDelivery ? comboDelivery.calculo : Formula.SIN_FORMULA,
            precio: comboDelivery ? comboDelivery.precio : 0,
            descuento: comboDelivery ? comboDelivery.descuento : 0,
            pro_size: comboDelivery ? comboDelivery.pro_size : 0,
            descuento_valor: comboDelivery ? comboDelivery.descuento_valor : 0,
            codeProducto: combo.IDPROMO,
        })
    }

    resolveCodeProducto(){
        return (this.codeProducto && this.codeProducto!== "0")?this.codeProducto:('id_'+this.IdProducto)
    }
}