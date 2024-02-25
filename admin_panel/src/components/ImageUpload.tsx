import React, {useEffect, useRef, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, Form, Modal, Upload} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {Product} from "@/types";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const FileUpload= ({images, setFiles}: {images?: Product["images"] , setFiles: (file:File[])=> void}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [filesView, setFilesView] = useState<UploadFile[]>([]);
    useEffect(()=>{
        if (images && images.length > 0){
            const OldFiles = images.map((image,index)=>{
                return {
                    uid: String(index),
                    name: image,
                    status: 'loading',
                    url: 'http://localhost:3000/static/products/'+ image,
                }
            })
            setFilesView(OldFiles as any)
        }
    },[images])
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList }) => {
        const filesBlob = fileList.map(fileListItem =>{
            return fileListItem.originFileObj as File
        })
        setFilesView(fileList);
        setFiles(filesBlob);
    }
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    return (
        <>
            <Form.Item valuePropName="fileList" getValueFromEvent={normFile} required={false}>
            <Upload
                beforeUpload={() => false}
                listType="picture-card"
                fileList={filesView}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {filesView.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
                </Form.Item>
        </>
    );
};

export default FileUpload;