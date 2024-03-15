'use client'
import React, {useEffect, useState} from 'react';
import {Button, Dropdown, MenuProps, Space,Divider} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {Endpoints, host} from "@/constants";
import {AllCategories} from "@/types";

type SelectedItem = {id:string, title: string}
const CategoryDropDown: React.FC<{
    onItemClickCallback: (categoryId: string , typeId: string  | null)=> void,
    defaultValues?: {categoryId:string , typeId:string| null},
    pushEndItems: any}>
    = ({onItemClickCallback,defaultValues}) => {
    const [ActiveCategory, setActiveCategory] = useState<SelectedItem>()
    const [ActiveType, setActiveType] = useState<SelectedItem| null>()
    const [categoryData , setCategoryData] = useState<MenuProps['items']>([])
    useEffect(()=> {
        fetch(host + Endpoints.CategoriesAndTypes).then(response => response.json()).then((data: AllCategories) => {
            if(data.length > 0){
                const Items: MenuProps['items'] = []
                data.forEach((item, index) => {
                    if(defaultValues && item.id === defaultValues.categoryId){
                        setActiveCategory({title: item.title, id: item.id});
                    }
                    Items.push({
                        key: String(index + 1),
                        label: <button className="w-full flex flex-row" onClick={e => {
                            setActiveCategory({title: item.title , id: item.id})
                            setActiveType(null)
                            onItemClickCallback(item.id , null)
                        }}>
                            <img src={host + "/static/categories/" + item.icon} width={40} height={40}/>
                            {item.title}</button>,
                        type: 'sub menu',
                        children: item.types.map(type => {
                            if(defaultValues && type.id === defaultValues.typeId){
                                setActiveType({title: type.title, id: type.id});
                            }
                            return {
                                key: type.id,
                                label: <button onClick={async e => {
                                    setActiveCategory({title: item.title , id: item.id})
                                    setActiveType({title: type.title, id: type.id})
                                    onItemClickCallback(item.id , type.id)
                                }}> {type.title} </button>,
                            }})
                    } as any)
                })
                setCategoryData(Items)
            }
        })
    },[defaultValues])
    return (
        <Dropdown menu={ {items: categoryData}}
                  dropdownRender={(menu) => (
                      <div style={contentStyle}>
                          {React.cloneElement(menu as any, { style: menuStyle })}
                          <Divider style={{ margin: 0 }} />
                          <Space style={{ padding: 8 }}>
                              <Button type="primary">Click me!</Button>
                          </Space>
                      </div>
                  )}
                  trigger={['click']}>
            <Button>
                <Space>
                    Category:({ActiveCategory?.title}) <pre/>Type:({ActiveType?.title})
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default CategoryDropDown;