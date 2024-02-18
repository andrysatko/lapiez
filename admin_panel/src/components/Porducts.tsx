"use client"
import React, {useEffect, useState} from "react";
import {Product} from "@/types";
import {host,Endpoints} from "@/constants";
import Porudct from "@/components/Product";
import {ConfigProvider, List} from "antd";
function AllProducdts(){
    const [data, setData] = useState<Product[]>()
    const [isLoading, setLoading] = useState(true)
    useEffect(()=>{
        const url = host + Endpoints.AllProducts;
        fetch(url, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => setData(data))
        setLoading(false)
    }, [])
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    return (
        <ConfigProvider theme={{
            components: {
                Pagination: {
                    colorPrimary: '#fcb103',
                    colorPrimaryHover: '#b59205',
                    itemSize: 50,
                    colorSplit: '#fcb103',
                },
            },
        }}>
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                position:'top',
                align: 'center',
                pageSize: 2,
            }}
            dataSource={data}
            bordered={true}
            split={true}

            renderItem={(item) => <Porudct {...item} />}
        >
        </List>
    </ConfigProvider>
    )
}

export {AllProducdts}
