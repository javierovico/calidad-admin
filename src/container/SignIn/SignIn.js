import React from "react";
import {Button} from 'antd';
import {Formik, Form, Field} from "formik";
import {AntInput} from "../../components/UI/Antd/AntdInputWithFormik";
import axios from "axios";
import User from "../../modelos/User";
import openNotification from "../../components/UI/Antd/Notification";

const required = value => (value ? undefined : 'Requerido');


const SignIn = () => {
    return (
        <>
            <h2>Iniciar Sesion</h2>
            <Formik
                initialValues={{
                    user: '',
                    password: '',
                }}
                onSubmit={(values, {setSubmitting, setErrors, ...a}) => {
                    console.log(a)
                    console.log('aldo, values', values, setSubmitting)
                    axios({
                        url: User.URL_LOGIN,
                        method:'post',
                        data:values
                    }).then(({data})=>{

                    }).catch(error=> {
                        openNotification(error)
                        if(error?.response?.data?.errors){
                            setErrors(error.response.data.errors)
                        }else{
                            setErrors({
                                user:'error',
                                password:'error'
                            })
                        }
                    })
                }}>
                {({handleSubmit, submitCount, values}) =>
                    <Form onSubmit={handleSubmit}>
                        <Field
                            component={AntInput}
                            validate={required}
                            name="user"
                            type="text"
                            size="large"
                            placeholder="Usuario"
                            defaultValue={values.email}
                            submitCount={submitCount}
                            hasFeedback
                        />
                        <Field
                            component={AntInput}
                            validate={required}
                            name="password"
                            type="password"
                            size="large"
                            placeholder="Clave"
                            submitCount={submitCount}
                            hasFeedback
                        />
                        <Button
                            className="signin-btn"
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{width: '100%'}}
                        >
                            Iniciar Sesion
                        </Button>
                    </Form>
                }
            </Formik>
        </>
    );
}
export default SignIn;