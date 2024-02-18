import {Divider, Image, List} from 'antd';
import {useState, useEffect} from "react";
import {Product} from "@/types";
import {host, Endpoints, staticDir} from "@/constants"
import NImage from "next/image";
import WeightIcon from "../../public/weight.svg";
export default function Porudct ({id, title, description , discount , images, ProductWeight ,price , categoryId , typeId, CaloryInfo }: Product){

    return (
        <List.Item>
            <h2 className="font-normal text-sm">Product ID: {id}</h2>
            <h2 className="font-normal text-sm">CategoryId: {categoryId}</h2>
            <h2 className="font-normal text-sm">TypeId: {typeId ?? "null"}</h2>
            <Divider style={{borderLeft:'1 px solid gray'}}/>
            <h1 className="mt-2 font-bold text-5xl">{title}</h1>
        {images.length > 0 && <Image.PreviewGroup
            preview={{
                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
        >
            {images.map((image,index ) => {
                const url  = host + staticDir+"/products/" +   image;
                console.log(url)
                return (<Image key={index} src={url} alt={title} width={200} height={200}/>)
            }  )}
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
            <h2 className="mt-3 font-semibold text-xl">Ціна: {price} грн</h2>
            {discount && <h2 className="mt-3 font-semibold text-xl">Знижка: {discount}%</h2>}
            <div style={{height: 20 }} className="mt-3 flex items-center">
                <NImage src={WeightIcon} alt="weight" width={20} height={20}/>
                <h2 style={{marginLeft:3, fontSize: 20}} className="items-center font-semibold">Вага: {ProductWeight} г</h2>
            </div>
        </Image.PreviewGroup>}
        </List.Item>
    )}

function CaloryCell({title,value}: {title: string, value: string}){
    return (
        <div className="flex flex-col">
            <h3 className="font-normal text-sm">{title}</h3>
            <h3 className="font font-semibold text-sm mt-1 text-center">{value}</h3>
        </div>
    )
}