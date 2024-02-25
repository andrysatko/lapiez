"use client"
import {AllCategories, Product} from "@/types";
import {useEffect, useReducer, useState} from "react";
import ProductForm from "@/components/ProductForm";
import FileUpload from "@/components/ImageUpload";
import ConfigAnt from "@/app/Config";
import {Form, Input, Button, Select, Space, Dropdown, MenuProps, Flex, InputNumber} from 'antd';
import {host, Endpoints} from "@/constants";
import {DownOutlined} from "@ant-design/icons";
import {id} from "postcss-selector-parser";
import TextArea from "antd/es/input/TextArea";

type ProductFormData = Pick<Product, "title" | "description" | "discount" | "ProductWeight" | "price" | "categoryId" | "typeId"| "CaloryInfo"> & {Images: File[]} & {oldImages? : string[]}

export default function ProductFormItems({initialState,setState,handleSubmitForm, children}:{initialState: ProductFormData, setState: (state:any)=>void, handleSubmitForm: ()=>void, children?: React.ReactNode}){
    const [form] = Form.useForm();
    const {title, description, discount, ProductWeight, price, categoryId, typeId, oldImages, Images, CaloryInfo} = initialState;
    const [ActiveCategory, setActiveCategory] = useState<string>()
    const [ActiveType, setActiveType] = useState<string| undefined>()
    const [ActiveImageCategory , setActiveImageCategory] = useState<string | undefined>()
    const [categoryData , setCategoryData] = useState<MenuProps['items']>([])

    const handleSetfiles = (files: File[]) => {
        setState( {...initialState,  Images: files})
    }

    const PerformActiveIcon = (icon: string) => {
        const url = host+ "/static/categories/"+ icon
        setActiveImageCategory(url);
    }

    const handleChangeCategoryType = (categoryId:string, typeId?: string)=>{
        setState({...initialState, categoryId:id, typeId: id ?? undefined});
    }
    useEffect(()=> {
        const Items: MenuProps['items'] = []
        fetch(host + Endpoints.CategoriesAndTypes).then(response => response.json()).then((data: AllCategories) => {
            data.forEach((item, index) => {
                if(item.id === categoryId){
                    setActiveCategory(item.title);
                    PerformActiveIcon(item.icon);
                    ActiveType && setActiveType(item.types.find(type => type.id === typeId)?.title)
                }
                Items.push({
                    key: String(index + 1),
                    label: <button className="w-full flex flex-row" onClick={e => {
                        handleChangeCategoryType(item.id);
                        PerformActiveIcon(item.icon);
                        setActiveCategory(item.title);
                        setActiveType(undefined);
                    }}>
                        <img alt={item.title} src={host + "/static/categories/" + item.icon} width={40} height={40}/>
                        {item.title}</button>,
                    type: 'sub menu',
                    children: item.types.map(type => ({
                        key: type.id,
                        label: <button onClick={e => {
                            e.preventDefault();
                            handleChangeCategoryType(item.id, type.id);
                            PerformActiveIcon(item.icon);
                            setActiveCategory(item.title);
                            setActiveType(type.title);
                        }}> {type.title} </button>,
                    }))
                } as any)
            })
            setCategoryData(Items)
        }).then(data => data)
    }, [])
    return (
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
                            <Input  value={title} onChange={e=> {setState({...initialState,title: e.target.value})}}/>
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
                            <TextArea value={description} rows={4} maxLength={100} onChange={e=>{ setState({...initialState,description: e.target.value})}}/>
                        </Form.Item>
                        <h2 className="mt-3 font-semibold text-sm">Add calories Info </h2>
                        <Flex vertical={false} justify={"space-between"} gap="large">
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs text-center">Proteins </h2>
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
                                    <InputNumber value={CaloryInfo.Proteins} onChange={value=>{value && setState({...initialState, CaloryInfo: {...initialState.CaloryInfo , Proteins: value}})}}/>
                                </Form.Item>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs text-center">Carbohydrates </h2>
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
                                    <InputNumber value={CaloryInfo.Carbohydrates} onChange={value=>{value && setState({...initialState, CaloryInfo: {...initialState.CaloryInfo , Carbohydrates: value}})}}/>
                                </Form.Item>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs text-center" >Fats </h2>
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
                                    <InputNumber value={CaloryInfo.Fats} onChange={value=>{value && setState({...initialState, CaloryInfo: {...initialState.CaloryInfo , Fats: value}})}}/>
                                </Form.Item>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="mt-3 font-semibold text-xs text-center">Calorie content </h2>
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
                                    <InputNumber value={CaloryInfo.CalorieContent} onChange={value=>{value && setState({...initialState, CaloryInfo: {...initialState.CaloryInfo , CalorieContent: value}})}}/>
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
                            <InputNumber  addonAfter="₴" value={price} onChange={value=>{ setState({...initialState,price: value ?? initialState.price})}}/>
                        </Form.Item>
                        <h2 className="mt-3 font-semibold text-sm" >Discount </h2>
                        <Form.Item
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    message: 'Required field'
                                },
                            ]}>
                            <InputNumber  addonAfter="%" value={discount} onChange={value=>{ setState({...initialState,discount: value ?? initialState.discount})}}/>
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
                            <InputNumber  addonAfter="грам" value={ProductWeight}  onChange={value=>{value && setState({...initialState, ProductWeight: value})}}/>
                        </Form.Item>
                    </Space>
                    
                    <div className="md:ml-32 lg:ml-64 2xl:ml-72">
                        <h2 className="mt-3 font-semibold text-sm pb-5">Porudct Images </h2>
                        <FileUpload images={oldImages} setFiles={handleSetfiles} ></FileUpload>
                    </div>
                </div>
            {children}
        </Form>
    )
}