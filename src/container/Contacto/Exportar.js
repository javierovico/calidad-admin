import React, {useContext, useEffect, useState} from "react";
import {Select,Upload, Button,Col, Divider, Row, Table} from 'antd';
import {DownloadOutlined, UploadOutlined} from '@ant-design/icons';
import axios from "axios";
import Contacto from "../../modelos/FuenteUnicaContactos/Contacto";
import openNotification from "../../components/UI/Antd/Notification";
import {AuthContext} from "../../context/AuthProvider";
import TipoDocumento from "../../modelos/FuenteUnicaContactos/TipoDocumento";
import {dateFormateado} from "../../utils/Utils";
import exportExcel from "../../utils/exportExcel";
const Excel = require('exceljs')


function useListarParametros(){
    const {analizarError} = useContext(AuthContext)
    /** Zona para hacer un getter de los tipos de cedulas por pais **/
    const [tipoDocs,setTipoDocs] = useState([])
    useState(()=>{
        axios({
            url:TipoDocumento.URL_DESCARGA
        }).then(({data})=>{
            setTipoDocs(data.data.map(d=>new TipoDocumento(d)))
        }).catch(e=>{
            setTipoDocs([])
            analizarError(e)
            openNotification(e)
        })
    },[])

    return {
        tipoDocs,
    }
}

function useExcel(){
    const {analizarError} = useContext(AuthContext)
    const [archivos,setArchivos] = useState([]);
    const [columnaDocumento,setColumnaDocumento] = useState(null);
    const [columnasExcel,setColumnasExcel] = useState([]);
    const [columnasExcelAdicional,setColumnasExcelAdicional] = useState([]);
    const [contenidoExcel,setContenidoExcel] = useState([]);
    const [loading,setLoading] = useState(true);
    const [tipoDoc,setTipoDoc] = useState(null);
    useEffect(()=>{
        setLoading(true);
        setColumnaDocumento(null);
        setColumnasExcel([])
        setContenidoExcel([])
        setColumnasExcelAdicional([])
        if(archivos.length){
            const file = archivos[0]
            /** Este es el encargado de leer a nivel de archivo*/
            const reader = new FileReader()
            /** Se encarga de leer el Excel */
            const wb = new Excel.Workbook();
            reader.readAsArrayBuffer(file)
            reader.onload = () => {
                /** obtiene el buffer del archivo*/
                const buffer = reader.result;
                wb.xlsx.load(buffer).then(workbook => {
                    /** Leemos la primera pagina*/
                    const sheet = workbook.getWorksheet(1)
                    /** Guardamos la fila de la cabecera (la primera fila)*/
                    const cabezera = sheet.getRow(1).values.map((r,pos)=>({key:'i_'+pos,value:(r.result) ?
                        (r.result) :
                        (
                            (r instanceof Date) ?
                                dateFormateado(r) :
                                r
                        )})).filter(r=>r)
                    /** Iteramos las filas restantes */
                    let contenido = []
                    sheet.eachRow((row,rowIndex) =>{
                        if(rowIndex !== 1){
                            contenido.push(row.values.reduce((acum,r,pos)=>
                                Object.assign(acum, {['i_'+pos]:(r.result) ?
                                    (r.result) :
                                    (
                                        (r instanceof Date) ?
                                            dateFormateado(r) :
                                            r
                                    )})
                            ,{_position:rowIndex}))
                        }
                    })
                    console.log(contenido);
                    setColumnasExcel(cabezera)
                    setContenidoExcel(contenido)
                    setLoading(false);
                })
            }
        }else{
            setColumnasExcel([])
            setContenidoExcel([])
            setLoading(false);
        }
    },[archivos])

    const [enviandoDoc,setEnviandoDoc] = useState(false);
    const [descargandoDoc,setDescargandoDoc] = useState(false);
    const handleDownload = () => {
        setDescargandoDoc(true);
        exportExcel('fuente-unica',contenidoExcel,columns)
            .catch(e=>openNotification(e))
            .finally(()=>setDescargandoDoc(false))
    }
    const handleSendDoc = () =>{
        setEnviandoDoc(true);
        axios({
            url:Contacto.URL_COGER_MASIVO,
            params:{
                documentos:contenidoExcel.map(ce=>ce[columnaDocumento]),
                tipo_doc_id:tipoDoc
            }
        }).then(({data})=>{
            let cantidadTelefono = 0;       //para saber cuantas columnas ir agregandole (maximo 10)
            const nuevoValores = contenidoExcel.map(ce=>{
                const valorBase = data.personas.find(p=>p.doc === (''+ce[columnaDocumento]))
                let n_cliente = ''
                const telefonos = []
                if(valorBase){
                    //Nombre y apellido
                    n_cliente = valorBase.nombre;
                    n_cliente += (n_cliente)?' ':'';
                    n_cliente += valorBase.apellido;
                    cantidadTelefono = Math.min(valorBase.telefonos.length,10)
                    for(let i = 0; i < Math.min(valorBase.telefonos.length,10); i++){
                        telefonos['n_tel_'+i] = valorBase.telefonos[i].telefono
                    }
                }
                return {
                    n_cliente,
                    ...telefonos,
                    ...ce,
                }
            })
            const nuevasColumnas = [{key:'n_cliente',value:'Cliente Encontrado'}]
            for(let i = 0;i<cantidadTelefono;i++){
                nuevasColumnas.push({key:`n_tel_${i}`,value:`Telefono ${i+1}`})
            }
            setContenidoExcel(nuevoValores)
            setColumnasExcelAdicional(nuevasColumnas)
        }).catch(e=>{
            analizarError(e)
            openNotification(e)
        }).finally(()=>setEnviandoDoc(false))
    }

    const columns = (columnasExcelAdicional.map((c,index)=>({
        title: <b style={{backgroundColor:'ff'}}>{c.value}</b>,
        dataIndex: c.key,
        key: c.key,
        fixed:index === 0?'left':undefined,
        // render: item => <p>{item.id}</p>
    }))).concat(columnasExcel.map(c=>({
        title: c.value,
        dataIndex: c.key,
        key: c.key,
        // render: item => <p>{item.id}</p>
    })));

    return {
        archivos,
        setArchivos,
        columnaDocumento,
        setColumnaDocumento,
        columnasExcel,
        columnasExcelAdicional,
        contenidoExcel,
        loading,
        handleSendDoc,
        enviandoDoc,
        tipoDoc,
        setTipoDoc,
        handleDownload,
        descargandoDoc,
        columns,
    }
}


export default function Exportar() {
    const {
        tipoDocs,
    } = useListarParametros();
    const {
        archivos,
        setArchivos,
        columnaDocumento,
        setColumnaDocumento,
        columnasExcel,
        columnasExcelAdicional,
        contenidoExcel,
        loading,
        handleSendDoc,
        handleDownload,
        enviandoDoc,
        setTipoDoc,
        tipoDoc,
        descargandoDoc,
        columns,
    } = useExcel();

    return <>
        <Divider>Entrada</Divider>
        <Row justify="space-around">
            <Col span={5}>
                <Upload
                    onRemove={()=>{
                        setArchivos([])
                    }}
                    beforeUpload={file=>{
                        setArchivos([file])
                        return false;
                    }}
                    fileList={archivos}
                >
                    {archivos.length === 0 && <Button icon={<UploadOutlined/>}>Click Para seleccionar</Button>}
                </Upload>
            </Col>
            <Col span={5}>
                <Select
                    showSearch
                    value={columnaDocumento}
                    onChange={setColumnaDocumento}
                    style={{ width: 200 }}
                    placeholder="Seleccione Columna Doc"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >{
                    columnasExcel.map(c=>
                        <Select.Option key={c.key} value={c.key}>{c.value}</Select.Option>
                    )
                }
                </Select>
            </Col>
            <Col span={5}>
                <Select
                    showSearch
                    value={tipoDoc}
                    onChange={setTipoDoc}
                    style={{ width: 200 }}
                    placeholder="Seleccione Tipo Doc"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >{
                    tipoDocs.map((c,i)=>
                        <Select.Option key={c.id} value={c.id}>{`${c.codigo} (${c.codigo_pais})`}</Select.Option>
                    )
                }
                </Select>
            </Col>
            <Col span={5}>
                { (columnasExcelAdicional.length === 0)
                    ? <Button disabled={!columnaDocumento || !tipoDoc || enviandoDoc} onClick={handleSendDoc}>Procesar</Button>
                    : <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} disabled={descargandoDoc}>Descargar</Button>
                }
            </Col>
        </Row>
        <Divider>Resultados</Divider>
        <Table
            columns={columns}
            dataSource={contenidoExcel}
            rowKey="_position"
            loading={loading || enviandoDoc}
            scroll={{x:1300, /*y:800*/}}
            pagination={{
                showSizeChanger:true,
            }}
        />
    </>
}