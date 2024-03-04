'use client'
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useSearchParams} from 'next/navigation'
import {useRouter} from "next/navigation";
import {Product} from "@/types";
import {Endpoints, host} from "@/constants";
import {Button, Checkbox, CheckboxProps, Input, List} from "antd";
import Porudct from "@/components/Product";
import Link from "next/link";
import CategoryDropDown from "@/components/CategoryDropDown";

const Page = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const params = new URLSearchParams(searchParams.toString());

    const handleChangePage = (page:number)=>{
        params.set("page", page.toString())
        router.push(pathname + '?' + params.toString())}
    const handleChangeDiscount = (discount: boolean)=>{
        discount ? params.set("discount", discount.toString()) : params.delete("discount")
        router.push(pathname + '?' + params.toString())}
    const handleChangeAvailable = (available: boolean)=>{
        available ? params.set("available", available.toString()): params.delete("available")
        router.push(pathname + '?' + params.toString())}
    const handleChangeNotAvailable = (notAvailable: boolean)=>{
        notAvailable ?  params.set("notAvailable", notAvailable.toString()): params.delete("notAvailable")
        router.push(pathname + '?' + params.toString())}
    const QueryActivePage = searchParams.has("page") ?  Number(searchParams.get('page')) : 1
    const QueryDiscount = searchParams.get('discount') === 'true'
    const QueryAvailable  = searchParams.get('available')  === 'true'
    const QueryNotAvailable = searchParams.get('notAvailable') === 'true'
    const [data, setData] = useState<Product[]>();
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        const url = host + Endpoints.AllProducts;
        fetch(url, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(data)
            } )
        setLoading(false)
    }, [])


    const HandleUpdateProduct = (ProductId: string, product: Partial<Product>)=>{
        const ProductIndex = data?.findIndex((item) => item.id === ProductId);
        if(ProductIndex){

        }
    }
    const HandleDeleteProduct = (ProductId: string )=>{
        setData(data?.filter((item) => item.id !== ProductId))
    }

    const [FilterData , setFilteredData] = useState<Product[]>()
    useEffect(() => {
        data && setFilteredData(data)
    }, [data]);
    const [SelectedFilters , setSelectedFilters] =
        useState<{Available: boolean, NotAvailable: boolean, Discount: boolean, Category:{categoryId:string,typeId: string | null} | undefined, SearchName: string | undefined }>({Available:QueryAvailable , NotAvailable: QueryNotAvailable, Discount:QueryDiscount, Category: undefined, SearchName: undefined})

    useEffect(() => {
        if(SelectedFilters && data){
            const {Available, NotAvailable, Discount, Category, SearchName} = SelectedFilters;
            let FilteredData = data;
            if(Available){
                FilteredData = FilteredData.filter((item) => item.available);
            }
            if(NotAvailable){
                FilteredData = FilteredData.filter((item) => !item.available);
            }
            if(Discount){
                console.log("DISCOUNT", Discount)
                FilteredData = FilteredData.filter((item) => item.discount);
            }
            if(Category){
                FilteredData = FilteredData.filter((item) => item.categoryId === Category.categoryId);
                if(Category.typeId){
                    FilteredData = FilteredData.filter((item=> item.typeId === Category.typeId));
                }
            }
            if(SearchName){
                FilteredData = FilteredData?.filter(({ title }) =>
                    title.toLowerCase().includes(SearchName.toLowerCase())
                )
            }
            setFilteredData(FilteredData);
        }
    }, [SelectedFilters,data]);

    const onChangeNotAvailable: CheckboxProps['onChange'] = (e) => {
        if(e.target.checked){
            handleChangeNotAvailable(true)
            handleChangeAvailable(false)
            setSelectedFilters({...SelectedFilters , NotAvailable: true, Available: false});
        }
        else{
            handleChangeNotAvailable(false)
            setSelectedFilters({...SelectedFilters , NotAvailable: false});
        }
    }
    const onChangeAvailable: CheckboxProps['onChange'] =(e)=> {
        if(e.target.checked){
            handleChangeAvailable(true)
            handleChangeNotAvailable(false)
            setSelectedFilters({...SelectedFilters, Available: true, NotAvailable: false});
        }
        else {
            handleChangeAvailable(false)
            setSelectedFilters({...SelectedFilters, Available: false})
        }
    }

    const onChangeDiscount: CheckboxProps['onChange'] =(e)=> {
        handleChangeDiscount(e.target.checked)
        e.target.checked ? setSelectedFilters({...SelectedFilters, Discount: true}) : setSelectedFilters({...SelectedFilters, Discount: false});
    }
    const ChangeCategoryWithType = (categoryId: string, typeId: string | null)=>{
        setSelectedFilters({...SelectedFilters, Category: {categoryId, typeId}})
    }
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    return (
        <div>
            <div className="flex flex:row items-center mt-10">
                <h1 className="text-2xl">Products</h1>
                <Link className='ml-3' href="products/create_product">
                    <Button type="primary" >
                        Create Product
                    </Button>
                </Link>
            </div>
            <div className="flex flex-col lg:flex-row mt-3 justify-between">
                <div style={{color:"#e69004"}} className="flex flex-row text-lg gap-2">
                    <div >All <span style={{color:"black"}}>({data.length})</span></div>
                    |
                    <div>Available <span style={{color:"black"}}>({data.filter((item) => item.available).length})</span></div>
                    |
                    <div>Not available <span style={{color:"black"}}>({data.filter((item) => !item.available).length})</span></div>
                </div>
                <div className="flex flex-row gap-1 w-80 mr-10">
                    <Input onChange={e=> setSelectedFilters({...SelectedFilters, SearchName: e.target.value})} placeholder="Search products by name"/>
                    <Button type="default">search</Button>
                </div>
            </div>
            <div className="flex flex-row gap-3 mt-5">
                <Checkbox checked={SelectedFilters.Available} onChange={onChangeAvailable}>Available</Checkbox>
                <Checkbox checked={SelectedFilters.NotAvailable}  onChange={onChangeNotAvailable}>Not available</Checkbox>
                <Checkbox checked={SelectedFilters.Discount} onChange={onChangeDiscount}>Discount</Checkbox>
            </div>
            <div className="mt-3">
                <CategoryDropDown onItemClickCallback={ChangeCategoryWithType}></CategoryDropDown>
            </div>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    position: 'top',
                    align: 'center',
                    pageSize: 2,
                    defaultCurrent: QueryActivePage,
                    onChange: (page) => {handleChangePage(page)},
                }}
                dataSource={FilterData}
                split={true}
                renderItem={(item) => <Porudct key={item.id} {...item} deleteProduct={HandleDeleteProduct}/>}
            >
            </List>
        </div>
    )
};

export default Page;