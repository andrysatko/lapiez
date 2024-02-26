import React, {useEffect, useRef, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, Form, Modal, Upload} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {Product, UpdateFileData} from "@/types";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const FileUpload= ({oldImages, setFiles}: {oldImages?: Product["images"] , setFiles: (file:File[],FileData?: UpdateFileData)=> void}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [filesView, setFilesView] = useState<UploadFile[]>([]);
    useEffect(()=>{
        if (oldImages && oldImages.length > 0){
            const OldFiles = oldImages.map((image, index)=>{
                return {
                    uid: String(index),
                    name: image,
                    status: 'loading',
                    url: 'http://localhost:3000/static/products/'+ image,
                }
            })
            setFilesView(OldFiles as any)
        }
    },[oldImages])
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
        const filesBlob: File[] = [];
        if(oldImages && oldImages.length>0){
            const fileData: UpdateFileData = {};
            for(let index = 0 ; index <  fileList.length ; index++){
                if(fileList[index].originFileObj){
                    filesBlob.push(fileList[index].originFileObj as File);
                    if(oldImages[index] &&  oldImages[index] !== fileList[index].name){
                     fileData.replace = fileData.replace ? [...fileData.replace, {fileName:fileList[index].name, index}] : [{fileName: fileList[index].name, index}];
                    }
                    if(!oldImages[index]){
                        fileData.push = fileData.push ? [...fileData.push, fileList[index].name] : [fileList[index].name];
                    }
                }
            }
            if(fileList.length < oldImages.length){
                oldImages.map((image, index)=>{
                if(!fileList[index]){
                        fileData.remove = fileData.remove ? [...fileData.remove, index] : [index];
                    }
                })
            }
            setFilesView(fileList);
            setFiles(filesBlob, fileData);
        }else{
            fileList.filter(FILES => FILES.originFileObj).map(fileListItem =>{
                filesBlob.push(fileListItem.originFileObj as File);
            })
            setFilesView(fileList);
            setFiles(filesBlob);
        }
    }
    const handleRemoveImage = (file: UploadFile) => {
        console.log(123)
        const fileIndex =  filesView.findIndex((fileItem) => fileItem.uid === file.uid);
        const newState = filesView;
        newState[fileIndex] = {uid:fileIndex.toString(),name: "removed"  };
        setFilesView(newState);
    };
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