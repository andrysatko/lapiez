"use client"
import {AllCategories, Product} from "@/types";
import ProductForm from "@/components/ProductForm";
import FileUpload from "@/components/ImageUpload";
import ConfigAnt from "@/app/Config";
import {DownOutlined} from "@ant-design/icons";
import {id} from "postcss-selector-parser";
import TextArea from "antd/es/input/TextArea";
import GenericProductForm from "@/components/GenericProductForm";


export default function CreatePostForm(){
    return (
        <>
        <GenericProductForm></GenericProductForm>
        </>
    )
}
// 'use client'
// import React, {useEffect, useState} from 'react';
// import {Endpoints, host} from "@/constants";
// import {Product} from "@/types";
// import {Button, Form} from "antd";
// import ProductFormItems from "@/components/ProductFormItems";
//
// type ProductFormData = Pick<Product, "title" | "description" | "discount" | "ProductWeight" | "price" | "categoryId" | "typeId"| "CaloryInfo"> & {Images: File[]} & {oldImages? : string[]}
//
// const Page = () => {
//     const EmptyData: ProductFormData = {title: "1", description: "123", discount: null, ProductWeight: 0, price: 0, categoryId: "", typeId: null, Images: [],  CaloryInfo: {Proteins: 0, Carbohydrates: 0, Fats: 0, CalorieContent: 0}}
//     const [form] = Form.useForm();
//     const [initialState ,setInitialState] = useState(EmptyData)
//     const {title, description, discount, ProductWeight, price, categoryId, typeId, CaloryInfo , Images} = initialState;
//     const handleSubmitForm = async ()=>{
//         console.log(initialState)
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         discount && formData.append('discount', '' + discount);
//         formData.append('ProductWeight', '' + ProductWeight);
//         formData.append('price', '' + price);
//         formData.append('categoryId', categoryId);
//         typeId && formData.append('typeId', '' + typeId);
//         formData.append('CaloryInfo', JSON.stringify(CaloryInfo));
//         Images.forEach((file, index) => {
//             formData.append('files', file, file.name);
//         });
//         console.log(formData)
//         // const response = await fetch(host + Endpoints.CreateProduct, {
//         //     method: 'POST',
//         //     body: formData
//         // })
//     } // This function is not used in this component, it is used in the parent component
//     return (
//         <>
//             <ProductFormItems initialState={initialState} setState={setInitialState} handleSubmitForm={handleSubmitForm}>
//                 <Button type="default" htmlType="submit">Create</Button>
//             </ProductFormItems>
//         </>
//     );
// };
//
// export default Page;
//
