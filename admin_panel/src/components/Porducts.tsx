"use client"
import React, {useEffect, useState} from "react";
import {Product} from "@/types";
import {host,Endpoints} from "@/constants";
import Porudct from "@/components/Product";
import {ConfigProvider, List} from "antd";
import EditProductForm from "@/components/EditProductForm";
function AllProducdts(){
    const [data, setData] = useState<Product[]>();
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        const url = host + Endpoints.AllProducts;
        fetch(url, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => setData(data))
        setLoading(false)
    }, [])


    const [editingProduct, setEditingProduct] = useState<Product | undefined>()

    const HandleUpdateProduct = (ProductId: string, product: Partial<Product>)=>{
        const ProductIndex = data?.findIndex((item) => item.id === ProductId);
        if(ProductIndex){

        }
    }
    const HandleEditButtonClick = (product: Product) => {
        setEditingProduct(product)
    }
    const HandleEditCloseButton = () => {
        setEditingProduct(undefined)
    }

    // const [IsOpenChangeProduct , setOpenChangeProduct] = useState<boolean>(false)
    // const handleOpenChangeProduct = () => {
    //     setOpenChangeProduct(true)
    // }
    // const handleCloseChangeProduct = () => {
    //     setOpenChangeProduct(false)
    // }
    //
    // const handleChangeProduct = (product: Product, oldId: string) => {
    //     const index = data?.findIndex((item) => item.id === oldId);
    //     index && setData((prev) => {
    //         let newData = prev!;
    //         newData[index] = product;
    //         return newData;
    //     })
    // }

    //
    //
    // const HandleUpdateProduct = ()=> {
    //
    //         fetch(host + Endpoints.CreateProduct, { method: "POST",cache: 'no-store' })
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log(data)
    //                 if(data){
    //                 }
    //             })
    //     }
    // }

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    return (
        <div>
                <List
                itemLayout="vertical"
                size="large"
                style={{display: editingProduct ?  'none' : "block"}}
                pagination={{
                    position: 'top',
                    align: 'center',
                    pageSize: 2,
                }}
                dataSource={data}
                split={true}
                renderItem={(item) => <Porudct {...item} EditButtonClick={HandleEditButtonClick} />}
            >
            </List>
            {editingProduct && <EditProductForm product={editingProduct} CloseEditForm={HandleEditCloseButton} />}
        </div>
    )
}

export {AllProducdts}
