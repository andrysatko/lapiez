import {Button, Divider, Flex, Image, List, Modal} from 'antd';
import {useState, useEffect} from "react";
import {Product} from "@/types";
import {host, Endpoints, staticDir} from "@/constants"
import NImage from "next/image";
import WeightIcon from "../../public/weight.svg";
import EditIcon from "../../public/edit.svg";

type ParrentHandler = { ResetProduct(UpdateProduct: Product,oldId: string): void }
export default function Porudct ({ ResetProduct, ...product}: Product & ParrentHandler){
    const {id, title, description , discount , images, ProductWeight ,price , categoryId , typeId, CaloryInfo } = product;
    const [ChnagedProduct, setChangedProduct] = useState<Partial<Product> | undefined>()
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [EditModalOpen , setEditModalOpen] = useState<boolean>(false);
    const [ConfirmDeleteProduct, setConfirmRemoveProduct] =  useState<boolean>(false);
    // const [HideItemFromClients, setHideItemsFromClients]=useState<boolean>(false);
    const showModal = () => {
        setEditModalOpen(true);
    };

    const hideModal = () => {
        setEditModalOpen(false);
    };

    const HandleUpdateProduct = ()=> {
        setConfirmLoading(true);
        if(ChnagedProduct){
            fetch(host + Endpoints.CreateProduct, { method: "POST",cache: 'no-store' })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if(data){
                        ResetProduct(data, id)
                    }
                })
        }
        setEditModalOpen(false)
        setConfirmLoading(false)
    }

    const HandleCancelUpdate = () => {
        setChangedProduct(undefined)
        hideModal()
    }

    return (
        <List.Item style={{marginTop: 20, borderBottom: "1px solid black"}}>
            <h2 className="font-semibold text-sm">Product ID: <span className="text-red-500">{id}</span></h2>
            <h2 className="font-semibold text-sm">CategoryId: <span className="text-blue-600">{categoryId}</span></h2>
            <h2 className="font-semibold text-sm">TypeId: <span className="text-blue-600">{typeId ?? "NULL"}</span></h2>
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
        </Image.PreviewGroup>}
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
            <h2 className="mt-3 font-semibold text-xl">Ціна: <span className="text-red-600">{price}</span> грн</h2>
            {discount && <h2 className="mt-3 font-semibold text-xl">Знижка: {discount}%</h2>}
            <div style={{height: 20 }} className="mt-3 flex items-center">
                <NImage src={WeightIcon} alt="weight" width={20} height={20}/>
                <h2 style={{marginLeft:3, fontSize: 20}} className="items-center font-semibold">Вага: <span className="text-red-600">{ProductWeight}</span> г</h2>
            </div>
            <Flex style={{paddingTop:20}} gap="large" wrap="wrap">
                <Button
                    type="primary"
                    icon={<NImage src={EditIcon} alt="edit" width={20} height={20}/>}
                    onClick={() => {showModal()}}
                    color={"yellow"}
                    style={{background: "#f2e63a", color: "black", fontWeight: "bold"}}
                >
                    Edit product
                </Button>
                <Button
                    type="primary"
                    style={{background: "#fc9b92", color: "black", fontWeight: "bold"}}>
                    Delete product
                </Button>
            </Flex>
            <Modal
                width={"60%"}
                title="Edit product"
                open={EditModalOpen}
                onOk={HandleUpdateProduct}
                confirmLoading={confirmLoading}
                onCancel={HandleCancelUpdate}
            >
                <p>test</p>
            </Modal>
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