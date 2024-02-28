'use client'
import React, {useCallback, useEffect, useState} from 'react';
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


    // const [DisabledCheckBoxes, setDisabledCheckBoxes] = useState<{available:boolean , notAvailable:boolean, discount:boolean}>({available:false, notAvailable:false, discount:false})
    // const onChangeAvailable: CheckboxProps['onChange'] = (e) => {
    //     e.target.checked
    //         ? (() => {
    //             setFilteredData(FilterData?.filter((item) => item.available));
    //             setDisabledCheckBoxes({...DisabledCheckBoxes, notAvailable:true});
    //         })()
    //         :
    //         (() => {
    //             setFilteredData(data);
    //             setDisabledCheckBoxes({...DisabledCheckBoxes, notAvailable:false});
    //         })();
    // };
    //
    // const onChangeNotAvailable: CheckboxProps['onChange'] = (e) => {
    //     e.target.checked
    //         ? (() => {
    //             setFilteredData(data?.filter((item) => !item.available));
    //             setDisabledCheckBoxes({...DisabledCheckBoxes, available:true});
    //         })()
    //         :
    //         (() => {
    //             setFilteredData(data);
    //             setDisabledCheckBoxes({...DisabledCheckBoxes, available:false});
    //         })();
    // }
    // const onChangeDiscount: CheckboxProps['onChange'] = (e) => {
    //     e.target.checked ? setFilteredData(FilterData?.filter((item) => item.discount)) : setFilteredData(FilterData);
    // }
    const [FilterData , setFilteredData] = useState<Product[]>()
    const [SelectedFilters , setSelectedFilters] =
        useState<{Available: boolean, NotAvailable: boolean, Discount: boolean, Category:{categoryId:string,typeId: string | null} | false }>({Available:false, NotAvailable:false, Discount:false, Category: false})

    useEffect(() => {
        if(SelectedFilters){
            const {Available, NotAvailable, Discount, Category} = SelectedFilters;
            let FilteredData = data;
            if(Available){
                FilteredData = FilteredData?.filter((item) => item.available);
            }
            if(NotAvailable){
                FilteredData = FilteredData?.filter((item) => !item.available);
            }
            if(Discount){
                FilteredData = FilteredData?.filter((item) => item.discount);
            }
            if(Category){
                FilteredData = FilteredData?.filter((item) => item.categoryId === Category.categoryId);
                if(Category.typeId){
                    FilteredData = FilteredData?.filter((item=> item.typeId === Category.typeId));
                }
            }
            setFilteredData(FilteredData);
        }
    }, [SelectedFilters]);

    const onChangeNotAvailable: CheckboxProps['onChange'] = (e) => {
        e.target.checked ? setSelectedFilters({...SelectedFilters , NotAvailable: true, Available: false}) : setSelectedFilters({...SelectedFilters , NotAvailable: false});
    }
    const onChangeAvailable: CheckboxProps['onChange'] =(e)=> {
        e.target.checked ? setSelectedFilters({...SelectedFilters, Available: true, NotAvailable: false}) : setSelectedFilters({...SelectedFilters, Available: false});
    }

    const onChangeDiscount: CheckboxProps['onChange'] =(e)=> {
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
                    <Input placeholder="Search products by name"/>
                    <Button type="default">search</Button>
                </div>
            </div>
            <div className="flex flex-row gap-3 mt-5">
                <Checkbox checked={SelectedFilters.Available} onChange={onChangeAvailable}>Available</Checkbox>
                <Checkbox checked={SelectedFilters.NotAvailable}  onChange={onChangeNotAvailable}>Not available</Checkbox>
                <Checkbox onChange={onChangeDiscount}>Discount</Checkbox>
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
                    defaultCurrent: ActivePage,
                    onChange: (page) => {handleChangePage(page)},
                }}
                dataSource={FilterData}
                split={true}
                renderItem={(item) => <Porudct {...item}/>}
            >
            </List>
        </div>
    )
};

export default Page;