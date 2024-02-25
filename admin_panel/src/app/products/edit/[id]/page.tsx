'use client'
import { useRouter } from 'next/navigation'
import React, {useEffect, useState} from "react";
import {host , Endpoints} from "@/constants";
import {Product, ProductFormData} from "@/types";
import GenericProductForm from "@/components/GenericProductForm";
type pageProps = {
    params : {id: string}
}
const  Page:React.FC<pageProps> = ({params})=> {
    const router = useRouter()

    return (
        <GenericProductForm productId={params.id}></GenericProductForm>
    )
}
export default Page;