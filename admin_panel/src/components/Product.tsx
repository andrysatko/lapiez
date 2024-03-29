import {Button, Divider, Flex, Image, List, Modal} from 'antd';
import {useState, useEffect} from "react";
import {Product} from "@/types";
import {host, Endpoints, staticDir} from "@/constants"
import NImage from "next/image";
import WeightIcon from "../../public/weight.svg";
import EditIcon from "../../public/edit.svg";
import Link from "next/link";

export default function Porudct ({ ...product}: Product ){
    const {id, title, description , discount , images, ProductWeight ,price , categoryId , typeId, CaloryInfo ,category, type,available} = product;
    return (

        <List.Item style={{marginTop: 20, borderBottom: "1px solid #fcb103"}}>
            <h2 className={`text-lg ${available ? 'text-green-500': 'text-red-500' }`}>{available ? "In stock": "Not available"}</h2>
            <h1 className="mt-2 font-bold text-5xl">{title}</h1>
            {images.length > 0 && <div className="mt-3"><Image.PreviewGroup
            preview={{
                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
        >
            {images.map((image,index ) => {
                const url  = host + staticDir+"/products/" +   image;
                console.log(url)
                return (<Image key={index} src={url} alt={title} width={250} height={250}/>)
            }  )}
        </Image.PreviewGroup>
            </div>}
            <h2 className="font-medium text-2xl">{description}</h2>
            <div className="mt-3 border-1 border-black inline-block p-3">
                <div className="flex flex-row">
                    <CaloryCell  title="Білки" value={`${CaloryInfo.Proteins} г`}/>
                    <Divider  style={{ borderLeft: '1px solid black' ,height:"auto"}} type={"vertical"} />
                    <CaloryCell title="Вуглеводи" value={`${CaloryInfo.Carbohydrates} г`}/>
                    <Divider  style={{ borderLeft: '1px solid black' ,height:"auto"}} type={"vertical"} />
                    <CaloryCell title="Жири" value={`${CaloryInfo.Fats} г`}/>
                    <Divider  style={{ borderLeft: '1px solid black' ,height:"auto"}} type={"vertical"} />
                    <CaloryCell title="Калорійність" value={`${CaloryInfo.Fats} ккал`}/>
                </div>
            </div>
            <h2 className="mt-3 font-semibold text-xl">Ціна: <span className="text-orange">{price}</span> грн</h2>
            {discount && <h2 className="mt-3 font-semibold text-xl">Знижка: <span className="text-orange">{discount}</span>%</h2>}
            <div style={{height: 20 }} className="mt-3 flex items-center">
                <NImage src={WeightIcon} alt="weight" width={20} height={20}/>
                <h2 style={{marginLeft:3, fontSize: 20}} className="items-center font-semibold">Вага: <span className="text-orange">{ProductWeight}</span> г</h2>
            </div>
            <Flex style={{paddingTop:40}} gap="large" wrap="wrap">
                <h2 className="font-semibold text-xm">Product ID: <span className="text-orange text-xs">{id}</span></h2>
                <h2 className="font-semibold text-sm">Category: <span className="text-orange text-xs">{category.title}</span> , category_id:<span className="text-orange text-xs"> {categoryId}</span></h2>
                <h2 className="font-semibold text-sm">Type: <span className="text-orange text-xs">{type?.title ?? "NULL"}</span> , type_id: <span className="text-orange text-xs"> {typeId ?? "NULL"}</span></h2>
            </Flex>
            <Flex style={{paddingTop:20}} gap="large" wrap="wrap">
                <Link href={`/products/edit/${id}`}>
                    <Button
                        icon={<div className="w-5 h-4">
                            <NImage src={EditIcon} alt="edit"/>
                        </div>}
                    >
                        Edit product
                    </Button>
                </Link>
            <Button
                type="primary"
                danger
                style={{ fontWeight: "bold"}}
            >
                Delete product
            </Button>
            </Flex>
        </List.Item>
    )}

function CaloryCell({title,value}: {title: string, value: string}){
    return (
        <div className="flex flex-col">
            <h3 className="font-normal text-xs">{title}</h3>
            <h3 className="font font-semibold text-sm mt-1 text-center">{value}</h3>
        </div>
    )
}