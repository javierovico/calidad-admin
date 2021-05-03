import React, {useContext, useEffect, useState} from "react";
import { setStateToUrl, useQueryParams} from "../../hook/useQueryParams";
import {
    Modal,
    Empty,
    Select,
    Col,
    Divider,
    Row,
    Table,
    DatePicker,
    Space,
    Button,
    Checkbox,
    Slider,
    InputNumber, Spin
} from 'antd';
import axios from "axios";
import openNotification from "../../components/UI/Antd/Notification";
import {AuthContext} from "../../context/AuthProvider";
import locale from 'antd/es/date-picker/locale/es_ES';
import QueueStat from "../../modelos/Calidad/QueueStat";
import Setup from "../../modelos/Calidad/Setup";
import {dateFormateado, dateFormateadoSinUTC, shuffleArray} from "../../utils/Utils";
import moment from 'moment';
import Evento from "../../modelos/Calidad/Evento";
import {DownloadOutlined} from "@ant-design/icons";
import exportExcel from "../../utils/exportExcel";

function useListarParametros(history){
    const {analizarError} = useContext(AuthContext)
    const query = useQueryParams()
    const {page,perPage,telefonosPersonaId,listaQname,rangoFecha} = query
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [showModalDescarga,setShowModalDescarga] = useState(false)
    const [descargandoExcel,setDescargandoExcel] = useState(false);
    const [descargaPorPorcentaje,setDescargaPorPorcentaje] = useState(true)
    const [descargaPorPorcentajePorcentaje,setDescargaPorPorcentajePorcentaje] = useState(40);
    useEffect(()=>{
        let cancelar = false;
        if(rangoFecha && listaQname?.length){
            setLoading(true);
            axios({
                url: QueueStat.URL_DESCARGA + '?XDEBUG_SESSION_START=PHPSTORM',
                params:{
                    with:['recording','enterqueues','completecallers','agente'],
                    append:['enterqueue','completecaller'],
                    inicio:rangoFecha[0]+' 00:00',
                    fin:rangoFecha[1]+' 00:00',
                    qname:listaQname,
                    descargar:1,
                }
            }).then(({data})=>{
                if(!cancelar){
                    setData(data.data.map(d=>new QueueStat(d)))
                }
            }).catch(error=>{
                if(!cancelar){
                    analizarError(error)
                    openNotification(error);
                }
            }).finally(()=>setLoading(false))
        }else{
            setData([])
        }
        return ()=>{
            cancelar = true;
        }
    },[listaQname,analizarError,rangoFecha])
    /** Zona para hacer un getter de los tipos de cedulas por pais **/
    const [setups,setSetups] = useState([])
    useState(()=>{
        axios({
            url:Setup.URL_DESCARGA
        }).then(({data})=>{
            setSetups(data.map(d=>new Setup(d)))
        }).catch(e=>{
            setSetups([])
            analizarError(e)
            openNotification(e)
        })
    },[])

    const handleChangeGroup = (obj) =>{
        const nuevoPush = { ...query, ...obj}
        history.push({search:setStateToUrl(nuevoPush)})
    }

    const handleDescargar = () =>{
        return new Promise((resolve, reject) => {
            setDescargandoExcel(true)
            let filtrado
            if(!descargaPorPorcentaje){
                filtrado = data
            }else{
                filtrado = shuffleArray([...data])
                const cantidad = parseInt(filtrado.length * descargaPorPorcentajePorcentaje / 100)
                filtrado.splice(cantidad,filtrado.length)
            }
            exportExcel('PBX',filtrado,columns)
                .then(r=>{
                    setShowModalDescarga(false)
                    resolve()
                })
                .catch(e=> {
                    openNotification(e)
                    reject()
                })
                .finally(()=>setDescargandoExcel(false))
        })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: ['recording','filename'],
            key: 'recording.filenameWithoutExtension',
            render: (filename) =>{
                return filename?.substr(filename.indexOf('/')+1)?.replace('.mp3','')?.replace('.','') || ''
            }
        },
        {
            title: 'PATH',
            dataIndex: ['recording','filename'],
            key: 'recording.filenamePath',
            render: (filename) =>{
                return filename?.substr(0,filename.indexOf('/')) || ''
            }
        },
        {
            title: 'Number',
            dataIndex: ['enterqueue','info2'],
            key: 'enterqueue.info2',
        },
        {
            title: 'DuracionTime',
            dataIndex: ['duration'],
            key: 'duration',
        },
        {
            title: 'Campaign',
            dataIndex: [],
            key: 'Campaign',
            render:(_,item) =>{
                return setups.find(s=>s.cola?.queue_id === item.qname)?.value || item.qname
            }
        },
        {
            title: 'Category1',
            dataIndex: [],
            key: 'Category1',
            render:(_,item) =>{
                return Evento.getEventNameById(item.qevent)
            }
        },
        {
            title: 'Agent',
            dataIndex: ['agente','agent'],
            key: 'agente.agent',
            render:(agente) =>{
                return agente?.substr(agente.indexOf('/')+1) || '0'
            }
        },
        {
            title: 'StartDate',
            dataIndex: ['datetime'],
            key: 'datetime',
        },
        {
            title: 'EndDate',
            dataIndex: [],
            key: 'EndDate',
            render: (_,item) =>{
                const horaInicial = new Date(item.datetime)
                horaInicial.setSeconds(horaInicial.getSeconds()+item.duration)
                return dateFormateadoSinUTC(horaInicial,true,true)
            }
        },
    ];

    return {
        setups,
        listaQname,
        data,
        handleDescargar,
        perPage,
        page,
        loading,
        telefonosPersonaId,
        handleChangeGroup,
        rangoFecha,
        setDescargandoExcel,
        setShowModalDescarga,
        showModalDescarga,
        descargandoExcel,
        descargaPorPorcentaje,
        setDescargaPorPorcentaje,
        descargaPorPorcentajePorcentaje,
        setDescargaPorPorcentajePorcentaje,
        columns,
    }
}

export default function Listar({history}) {
    const {
        data,
        page,
        loading,
        handleChangeGroup,
        perPage,
        setups,
        listaQname,
        rangoFecha,
        handleDescargar,
        setDescargandoExcel,
        setShowModalDescarga,
        showModalDescarga,
        descargandoExcel,
        descargaPorPorcentaje,
        setDescargaPorPorcentaje,
        descargaPorPorcentajePorcentaje,
        setDescargaPorPorcentajePorcentaje,
        columns,
    } = useListarParametros(history);
    return <>
        <Divider>Filtrado</Divider>
        <Row justify="space-around">
            <Col span={7}>
                <Space direction="vertical" size={12}>
                    <DatePicker.RangePicker
                        value={rangoFecha?([moment(rangoFecha[0],'YYYY-MM-DD'),moment(rangoFecha[1],'YYYY-MM-DD')]):[]}
                        onChange={(value)=>{
                            handleChangeGroup({page:1,rangoFecha:value?([dateFormateado(value[0].toDate(),false),dateFormateado(value[1].toDate(),false)]):null})
                        }}
                        locale={locale}
                    />
                </Space>
            </Col>
            <Col span={9}>
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Seleccione campana(s)"
                    value={listaQname}
                    onChange={(val)=>{
                        handleChangeGroup({page:1,listaQname:val})
                    }}
                >
                    {setups.map(c=>
                        <Select.Option
                            key={c.cola.queue_id}
                            value={c.cola.queue_id}
                        >
                            {c.value}
                        </Select.Option>
                    )}
                </Select>
            </Col>
            <Col span={3}>
                    <Button icon={<DownloadOutlined />} disabled={loading || data.length === 0} onClick={()=>{
                        setDescargandoExcel(false);
                        setShowModalDescarga(true);
                    }}>Descargar</Button>
            </Col>
        </Row>
        <Divider>Resultados</Divider>
        <Table
            locale={{
                emptyText:<Empty
                    description={
                        <span>
                            {!(listaQname?.length) && <p>Seleccione campana</p>}
                            {!rangoFecha && <p>Seleccione Rango de fecha</p>}
                        </span>
                    }
                >
                </Empty>
            }}
            columns={columns}
            dataSource={data}
            rowKey="queue_stats_id"
            loading={loading}
            pagination={{
                showQuickJumper:true,
                showSizeChanger:true,
                pageSize:perPage,
                current:page,
                pageSizeOptions:['5','10','15','20','50'],
                onChange:(page,perPage)=>{
                    handleChangeGroup({page,perPage})
                    // handleChange(page,'page')
                    // handleChange(perPage,'perPage')
                },
            }}
        />
        <Modal
            title="Descarga"
            visible={showModalDescarga}
            okText={'Descargar'}
            onOk={()=>{
                return handleDescargar()
            }}
           onCancel={()=>{
               if(!descargandoExcel){
                   setShowModalDescarga(false)
               }
           }}
        >
            {
                descargandoExcel
                    ? <Row justify="center"><Col><Spin/></Col></Row>
                    :<Row justify="space-around">
                        <Col span={24}>
                            <Checkbox
                                checked={descargaPorPorcentaje}
                                onChange={(v)=>{
                                    setDescargaPorPorcentaje(v.target.checked)
                                    if(!v.target.checked){
                                        setDescargaPorPorcentajePorcentaje(100)
                                    }
                                }}
                            >
                                Descarga Aleatoria por porcentaje
                            </Checkbox>
                        </Col>
                        <Col span={12}>
                            <Slider
                                disabled={!descargaPorPorcentaje}
                                min={1}
                                max={100}
                                onChange={(value)=>{setDescargaPorPorcentajePorcentaje(value)}}
                                value={descargaPorPorcentajePorcentaje}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                disabled={!descargaPorPorcentaje}
                                min={1}
                                max={100}
                                style={{ margin: '0 16px' }}
                                value={descargaPorPorcentajePorcentaje}
                                onChange={(value)=>{setDescargaPorPorcentajePorcentaje(value)}}
                            />
                        </Col>
                    </Row>
            }
        </Modal>
    </>
}