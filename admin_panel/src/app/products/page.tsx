'use client'
import React, {useCallback, useEffect, useState} from 'react';
import {usePathname, useSearchParams} from 'next/navigation'
import {useRouter} from "next/navigation";
import {Product} from "@/types";
import {Endpoints, host} from "@/constants";
import {Button, List} from "antd";
import Porudct from "@/components/Product";
import Link from "next/link";

const Page = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleChangePage = useCallback((page:number)=>{
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(pathname + '?' + params.toString())
    }, [searchParams])
    const ActivePage = searchParams.has("page") ?  Number(searchParams.get('page')) : 1


    const [data, setData] = useState<Product[]>();
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        const url = host + Endpoints.AllProducts;
        fetch(url, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => setData(data))
        setLoading(false)
    }, [])


    const HandleUpdateProduct = (ProductId: string, product: Partial<Product>)=>{
        const ProductIndex = data?.findIndex((item) => item.id === ProductId);
        if(ProductIndex){

        }
    }

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    return (
        <div>
            <Link href="products/create_product">
            <Button type="primary" >
                Create Product
            </Button>
            </Link>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    position: 'top',
                    align: 'center',
                    pageSize: 2,
                    defaultCurrent: ActivePage,
                    onChange: (page) => {handleChangePage(page)},
                }}
                dataSource={data}
                split={true}
                renderItem={(item) => <Porudct {...item}/>}
            >
            </List>
        </div>
    )
};

export default Page;