'use client'
import React, {useState} from 'react';
import {Form, Input, Button, Modal} from 'antd';
import {host, Endpoints} from "@/constants";
import { useRouter } from 'next/navigation'
import { setCookie } from "cookies-next";

type UserSignIn = {
    name: string,
    password: string
}
type ModalInfo = {
    isWarning: boolean,
    title: string,
    content: string
}
type ServerTokensResponse = {
    access_token: string,
    refresh_token: string
}

const SignIn = () => {
    const router = useRouter()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [modalInfo, setModalInfo ] = useState<ModalInfo>({
        title: "",
        content: "",
        isWarning:false
    })
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        !modalInfo.isWarning &&  router.push('/dashboard/products')
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values: UserSignIn) => {
        showModal()
        const formData = new FormData();
        const body = {name: values.name, password: values.password }
        fetch(host + Endpoints.AdminSignIn,{body: JSON.stringify(body), method: "POST",headers: {
                'Content-Type': 'application/json',
            },})
            .then(response => {
                if(response.status === 200 || response.status === 201){
                    response.json()
                        .then((data: ServerTokensResponse)=> {
                            setCookie("access_token", data.access_token)
                            setCookie('refresh_token', data.refresh_token)
                        })
                    setModalInfo({title: "Success", content: "You are logged in", isWarning: false})
                }
                else{
                    console.log(response)
                    setModalInfo({title: "Warning", content: "Incorrect name or password", isWarning: true})
                }
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                layout="vertical"
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"}}>
                <Form.Item
                    label="name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input style={{width: 240}}/>
                </Form.Item >
                <Form.Item
                    label="password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}

                >
                    <Input.Password style={{width: 240}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Modal title={<p className={`${modalInfo.isWarning? "text-red-600" : undefined}`}>{modalInfo.title}</p>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{modalInfo.content}</p>
            </Modal>
            </div>
    );
};

export default SignIn;