import {notification,List} from "antd";
import React from "react";
import { BsXOctagonFill } from 'react-icons/bs';

const openNotification = (e,duracion = 30) => {
    let titulo
    if(e?.titulo){
        titulo = e.titulo
    }if(e?.response?.data?.message){
        titulo = e.response.data.message
    }
    let contenido
    if(e?.mensaje){
        contenido = <p>{e.mensaje}</p>
    }else if(e?.response?.data?.errors){
        // contenido = <pre>{JSON.stringify(e.response.data.errors,null,4)}</pre>
        contenido = <List
            itemLayout="horizontal"
            dataSource={Object.entries(e.response.data.errors)}
            renderItem={([nombre,errores]) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<BsXOctagonFill/>}
                        title={<b>{nombre}</b>}
                        description={
                            <List
                                dataSource={errores}
                                renderItem={(error)=>error}
                            />
                        }
                    />
                </List.Item>
            )}
        />
    }
    notification.open({
        message: <b>{titulo}</b>,
        description: contenido,
        duration: duracion,
        icon: <BsXOctagonFill style={{ color: '#e91010' }} />,
    });
};

export default openNotification