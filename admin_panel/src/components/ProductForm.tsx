import {Flex, Form, Input, InputNumber, Space} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Product} from "@/types";
import {useState} from "react";

type CommonProductProperty = Pick<Product, "title" | "description" | "price" | "ProductWeight"  | "CaloryInfo" | "discount">
export default function ProductForm({InputState, setProductState}:{InputState: CommonProductProperty, setProductState: (state: CommonProductProperty) => void}) {
    return (
        <div>
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
                <Input  value={InputState.title} onChange={e=> setProductState({...InputState,title: e.target.value})} />
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
                <TextArea value={InputState.description} rows={4} maxLength={100} onChange={e=>{ setProductState({...InputState,description: e.target.value})}}/>
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
                        <InputNumber value={InputState.CaloryInfo.Proteins} onChange={value=>{value && setProductState({...InputState, CaloryInfo: {...InputState.CaloryInfo , Proteins: value}})}}/>
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
                        <InputNumber value={InputState.CaloryInfo.Carbohydrates} onChange={value=>{value && setProductState({...InputState, CaloryInfo: {...InputState.CaloryInfo , Carbohydrates: value}})}}/>
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
                        <InputNumber value={InputState.CaloryInfo.Fats} onChange={value=>{value && setProductState({...InputState, CaloryInfo: {...InputState.CaloryInfo , Fats: value}})}}/>
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
                        <InputNumber value={InputState.CaloryInfo.CalorieContent} onChange={value=>{value && setProductState({...InputState, CaloryInfo: {...InputState.CaloryInfo , CalorieContent: value}})}}/>
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
                <InputNumber  addonAfter="₴" value={InputState.price} onChange={value=>{ setProductState({...InputState,price: value ?? InputState.price})}}/>
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
                    <InputNumber  addonAfter="%" value={InputState.discount} onChange={value=>{ setProductState({...InputState,price: value ?? InputState.price})}}/>
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
                <InputNumber  addonAfter="грам" value={InputState.ProductWeight}  onChange={value=>{value && setProductState({...InputState, ProductWeight: value})}}/>
                </Form.Item>
            </Space>
        </div>
    )
}