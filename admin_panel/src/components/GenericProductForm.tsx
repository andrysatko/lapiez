"use client"
import {AllCategories, Product, ProductFormData, UpdateFileData} from "@/types";
import {Dispatch, SetStateAction, useEffect, useReducer, useState} from "react";
import ProductForm from "@/components/ProductForm";
import FileUpload from "@/components/ImageUpload";
import ConfigAnt from "@/app/Config";
import {Form, Input, Button, Select, Space, Dropdown, MenuProps, Flex, InputNumber} from 'antd';
import {host, Endpoints} from "@/constants";
import {DownOutlined} from "@ant-design/icons";
import {id} from "postcss-selector-parser";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from 'next/navigation'
import useWindowDimensions from "@/hook/useWindowDimensions";

const EmptyState: ProductFormData = {title: "", description: "", discount: null, ProductWeight: 0, price: 0, categoryId: "", typeId: null, Images: [], CaloryInfo: {Proteins: 0, Carbohydrates: 0, Fats: 0, CalorieContent: 0}}

export default function GenericProductForm({productId}:{productId?: string}) {
    const [oldState, setOldState] = useState<ProductFormData| undefined>()
    const router = useRouter()
    const [state, setState] = useState(EmptyState)
    useEffect(()=>{
        if(productId){
            const url = host + Endpoints.ProductById + productId;
            fetch(url)
                .then<Product>(response => response.json())
                .then(data => {
                    if(data){
                        const {title, description, discount, ProductWeight, price, categoryId, typeId, images, CaloryInfo,category, type} = data;
                        const EmptyFileData: UpdateFileData = {
                            replace: [],
                            remove: [],
                            push: []
                        }
                        const FormDataState = {title, description, discount, ProductWeight, price, categoryId, typeId, Images: [], oldImages: images, CaloryInfo, FileData: EmptyFileData}
                        setState(FormDataState);
                        setOldState(FormDataState);
                        setActiveCategory(category.title);
                        setActiveType(type?.title ?? null);
                    }
                })
        }
    },[])
    const [form] = Form.useForm();
    const {title, description, discount, ProductWeight, price, categoryId, typeId, Images, oldImages, CaloryInfo} = state;

    const [ActiveCategory, setActiveCategory] = useState<string>()
    const [ActiveType, setActiveType] = useState<string| null>()
    const [ActiveImageCategory , setActiveImageCategory] = useState<string | null>()
    const [categoryData , setCategoryData] = useState<MenuProps['items']>([])

    const {width, height} =  useWindowDimensions()
    const handleSetfiles = (files: File[], FileData?: UpdateFileData) => {
        setState(prevState => ({...prevState, Images: files, FileData }));
    };


    useEffect(()=> {
        const setActiveicon = (icon: string) => {
            const url = host+ "/static/categories/"+ icon
            setActiveImageCategory(url);
        }
        const Items: MenuProps['items'] = []
        fetch(host + Endpoints.CategoriesAndTypes).then(response => response.json()).then((data: AllCategories) => {
            data.forEach((item, index) => {
                Items.push({
                    key: String(index + 1),
                    label: <button className="w-full flex flex-row" onClick={e => {
                        setState(prevState => ({...prevState, categoryId: item.id, typeId: null}));
                        setActiveicon(item.icon);
                        setActiveCategory(item.title);
                        setActiveType(null);
                    }}>
                        <img src={host + "/static/categories/" + item.icon} width={40} height={40}/>
                        {item.title}</button>,
                    type: 'sub menu',
                    children: item.types.map(type => ({
                        key: type.id,
                        label: <button onClick={e => {
                            setState(prevState => ({...prevState, categoryId: item.id, typeId: type.id}));
                            setActiveicon(item.icon);
                            setActiveCategory(item.title);
                            setActiveType(type.title);
                        }}> {type.title} </button>,
                    }))
                } as any)
            })
            setCategoryData(Items)
        }).then(data => data)
    }, [])

    const handleSubmitForm = async ()=>{
        console.log(state, "STATE")
        if(productId){
            const formData = new FormData();
            const  { Images,oldImages,...data} = state;
            Images.forEach((file, index) => {
                formData.append('files', file, file.name);
            });
            for (let key of Object.keys(data)) {
                if (key in state && oldState) {
                    const typedKey = key as keyof typeof state;
                    if (state[typedKey] !== oldState[typedKey]) {
                        let PushValue = (typeof state[typedKey] == "string" || typeof state[typedKey] ==typeof File) ?  state[typedKey] : JSON.stringify(state[typedKey])
                        formData.append(typedKey, PushValue as any);
                    }
                }
            }
            const response = await fetch(host + Endpoints.UpdateProduct + `/${productId}` , {
                method: 'PUT',
                body: formData
            })

        }
        else {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            discount && formData.append('discount', '' + discount);
            formData.append('ProductWeight', '' + ProductWeight);
            formData.append('price', '' + price);
            formData.append('categoryId', categoryId);
            typeId && formData.append('typeId', '' + typeId);
            formData.append('CaloryInfo', JSON.stringify(CaloryInfo));
            Images.forEach((file, index) => {
                formData.append('files', file, file.name);
            });
            const response = await fetch(host + Endpoints.CreateProduct, {
                method: 'POST',
                body: formData
            })
        }
    }

    form.setFieldsValue({"name": title})
    form.setFieldsValue({"description": description})
    form.setFieldsValue({"Proteins": CaloryInfo.Proteins})
    form.setFieldsValue({"Carbohydrates": CaloryInfo.Carbohydrates})
    form.setFieldsValue({"Fats": CaloryInfo.Fats})
    form.setFieldsValue({"CalorieContent": CaloryInfo.CalorieContent})
    form.setFieldsValue({"price": price})
    form.setFieldsValue({"discount": discount})
    form.setFieldsValue({"weight": ProductWeight})

    return (
        <>
            <Form form={form} onFinish={handleSubmitForm}>
                <Form.Item
                    name="dropdown"
                    rules={[
                        {
                            validator: (_, value) => categoryId ? Promise.resolve() : Promise.reject('Category should be provided'),
                            message: 'Category should be provided'
                        },
                    ]}
                >
                    <Dropdown menu={ {items: categoryData}} trigger={['click']}>
                        <Button>
                            <Space>
                                Category:({ActiveCategory}) <pre/>Type:({ActiveType})
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Form.Item>
                <div className="flex flex-col md:flex-row lg:flex-row 2xl:flex-row">
                    <Space direction="vertical">
                        <h2 className="mt-3 font-semibold text-sm">Product Name </h2>
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Input product name'
                                },
                            ]}
                        >
                            <Input  value={title} onChange={e=> setState(prevState => ({...prevState,title: e.target.value}))} />
                        </Form.Item>
                        <h2 className="mt-3 font-semibold text-sm">Description </h2>
                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Input product description'
                                },
                            ]}
                        >
                            <TextArea value={description} rows={4} maxLength={100} onChange={e=>{ setState(prevState => ({...prevState,description: e.target.value}))}}/>
                        </Form.Item>
                        <h2 className="mt-3 font-semibold text-sm">Add calories Info </h2>
                        <Flex vertical={width < 1140} justify={"space-between"} gap="large">
                            <div className="flex flex-col">
                                <h2 className={`mt-3 font-semibold text-xs  ${ width> 1000 && "text-start"}`}>Proteins </h2>
                                <Form.Item
                                    name="Proteins"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            message: 'Required field'
                                        },
                                    ]}
                                >
                                    <InputNumber value={CaloryInfo.Proteins} onChange={value=>{value && setState(prevState => ({...prevState,CaloryInfo: {...prevState.CaloryInfo, Proteins: value}}))}}/>
                                </Form.Item>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs">Carbohydrates </h2>
                                <Form.Item
                                    name="Carbohydrates"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            message: 'Required field'
                                        },
                                    ]}
                                >
                                    <InputNumber value={CaloryInfo.Carbohydrates} onChange={value=>{value && setState(prevState => ({...prevState, CaloryInfo: {...prevState.CaloryInfo, Carbohydrates: value}}))}}/>
                                </Form.Item>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs" >Fats </h2>
                                <Form.Item
                                    name="Fats"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            message: 'Required field'
                                        },
                                    ]}
                                >
                                    <InputNumber value={CaloryInfo.Fats} onChange={value=>{value && setState(prevState => ({...prevState, CaloryInfo: {...prevState.CaloryInfo, Fats: value}}))}}/>
                                </Form.Item>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs">Calorie content </h2>
                                <Form.Item
                                    name="CalorieContent"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            message: 'Required field'
                                        },
                                    ]}
                                >
                                    <InputNumber value={CaloryInfo.CalorieContent} onChange={value=>{value && setState(prevState => ({...prevState, CaloryInfo: {...prevState.CaloryInfo, CalorieContent: value}}))}}/>
                                </Form.Item>
                            </div>
                        </Flex>

                        <h2 className="mt-3 font-semibold text-sm" >Price </h2>
                        <Form.Item
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    message: 'Required field'
                                },
                            ]}>
                            <InputNumber  addonAfter="₴" value={price} onChange={value=>{ setState( prevState=>({...prevState, price: value ?? price}) )}}/>
                        </Form.Item>
                        <h2 className="mt-3 font-semibold text-sm" >Discount </h2>
                        <Form.Item
                            name="discount"
                            rules={[
                                {
                                    required: false,
                                    type: 'number',
                                    message: 'Required field'
                                },
                            ]}>
                            <InputNumber  addonAfter="%" value={discount} onChange={value=>{ setState( prevState=>({...prevState, discount: value ?? discount}) )}}/>
                        </Form.Item>
                        <h2 className="mt-3 font-semibold text-sm" >Weight</h2>
                        <Form.Item
                            name="weight"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    message: 'Required field'
                                },
                            ]}>
                            <InputNumber  addonAfter="грам" value={ProductWeight}  onChange={value=>{ setState( prevState=>({...prevState, ProductWeight: value ?? ProductWeight}) )}}/>
                        </Form.Item>
                    </Space>
                    <div className="md:ml-32 lg:ml-64 2xl:ml-72">
                        <h2 className="mt-3 font-semibold text-sm pb-5">Porudct Images </h2>
                        <FileUpload oldImages={oldImages} setFiles={handleSetfiles} ></FileUpload>
                    </div>
                </div>
                <Button type="default" htmlType="submit">{productId ? 'Update' : 'Create'}</Button>
            </Form>
            <Button danger className="mt-10" type="primary" onClick={()=>router.back()}>Cancel</Button>
        </>
    )
}
