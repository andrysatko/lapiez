import {Product} from "@/types";
import {Button, Input, Space, InputNumber} from "antd";
import {ClockCircleOutlined} from "@ant-design/icons";
import {Flex} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useState} from "react";
import FileUpload from "@/components/ImageUpload";
type Props = {
    CloseEditForm: () => void
}


export default  function EditProductForm({product,CloseEditForm }: {product: Product} & Props) {
    const [ProductData, setProduct ] = useState<Product>(product)
    const {id, title,description,discount , type ,category ,typeId , CaloryInfo ,categoryId ,ProductWeight ,images ,price ,updatedAt ,createdAt} = ProductData;
    return (
        <div>
        <div className="flex flex-col md:flex-row lg:flex-row 2xl:flex-row">
            <Space direction="vertical">
                <h2 className="mt-3 font-semibold text-sm">Product Name </h2>
                <Input  value={title} onChange={e=>{ setProduct(prevState => ({...prevState,title:e.target.value})) }} />
                <h2 className="mt-3 font-semibold text-sm">Description </h2>
                <TextArea value={description} rows={4} maxLength={100} onChange={e=>{ setProduct(prevState => ({...prevState,description:e.target.value})) }}/>
                <h2 className="mt-3 font-semibold text-sm">Add calories Info </h2>
                <Flex vertical={false} justify={"space-between"} gap="large">
                    <div className="flex flex-col">
                        <h2 className="mt-3 font-semibold text-xs text-center">Білки </h2>
                        <InputNumber value={CaloryInfo.Proteins} onChange={value=>{value && setProduct(prevState => ({...prevState,CaloryInfo:{...CaloryInfo, Proteins:value}})) }}/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="mt-3 font-semibold text-xs text-center">Вуглеводи </h2>
                        <InputNumber value={CaloryInfo.Carbohydrates} onChange={value=>{value && setProduct(prevState => ({...prevState,CaloryInfo:{...CaloryInfo, Carbohydrates:value}})) }}/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="mt-3 font-semibold text-xs text-center" >Жири </h2>
                        <InputNumber value={CaloryInfo.Fats} onChange={value=>{value && setProduct(prevState => ({...prevState,CaloryInfo:{...CaloryInfo, Fats:value}})) }}/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="mt-3 font-semibold text-xs text-center">Калорійність </h2>
                        <InputNumber value={CaloryInfo.CalorieContent} onChange={value=>{value && setProduct(prevState => ({...prevState,CaloryInfo:{...CaloryInfo, CalorieContent:value}})) }}/>
                    </div>
                </Flex>

                <h2 className="mt-3 font-semibold text-sm" >Ціна </h2>
                <InputNumber  addonAfter="₴" value={price} onChange={value=>{value && setProduct(prevState => ({...prevState,price:value})) }}/>
                <h2 className="mt-3 font-semibold text-sm" >Вага</h2>
                <InputNumber  addonAfter="грам" value={ProductWeight} onChange={value=>{value && setProduct(prevState => ({...prevState,ProductWeight:value})) }}/>
            </Space>
            <div className="md:ml-32 lg:ml-64 2xl:ml-72">
                <h2 className="mt-3 font-semibold text-sm pb-5">Porudct Images </h2>
                <FileUpload images={product.images}></FileUpload>
            </div>
        </div>
            <Button className="mt-10" type="primary" onClick={CloseEditForm}>Cancel</Button>
        </div>
    )
}