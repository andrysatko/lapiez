'use client'
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import LogoText from '../../public/logo-normalna.svg'
import DashboardImage from '../../public/layer groupdashboard.svg'
import DeliveryIcon from '../../public/fast-food-truck-truck-svgrepo-com.svg'
import ProductIcon  from '../../public/products-svgrepo-com.svg'
import UsersIcon  from '../../public/users-svgrepo-com.svg'
import ExistIcon from '../../public/exit-svgrepo-com.svg'
import CartIcon from '../../public/cart-shopping-svgrepo-com.svg'
import { Divider } from 'antd';
import {AllProducdts} from "@/components/Porducts";
import TetList from "@/components/testlist";
const { Header, Content, Footer, Sider } = Layout;



export default function Home() {
    const [visibleComponent , setVisibleComponent] = React.useState("default");


    const items  = [{src: ProductIcon , title : "Products"} , {src: UsersIcon , title: "Users"} , {src : DeliveryIcon, title: "Delivery"}, {src: CartIcon, title: "Cart"}, {src: ExistIcon, title: "Exit"}, ].map(
        (item, index) => ({
            key: String(index + 1),
            icon: <div><Image src={item.src} width={20} height={20} alt={item.title}/></div>,
            label: `${item.title}`,
            onClick: () => {
                setVisibleComponent(item.title)
            }
        }),
    );

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  return (
      <Layout>
          <Sider style={{ background: colorBgContainer, zIndex: 999 }}
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={(broken) => {
                  console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
              }}
              onAbort={(e) => {
                    console.log(e);
              }}
          >
              <div className="sticky top-0">
              <div className="h-28 w-full flex flex-col" style={{paddingLeft:24}}>
                  <div className="bg-amber-300 rounded-2xl p-2 w-2/3 h-1/2" style={{marginTop:20}}>
                      <Image src={LogoText} objectFit="contain"  alt="svg logo text"></Image>
                  </div>
                  <div className="flex flex-row  mt-7 h-1/2">
                      <Image src={DashboardImage} objectFit="contain" alt={"dashboard"}/>
                      <h1 className=" font-bold text-lg flex items-center justify-center h-full text-center text-amber-500 text-[100%]">Dashboard</h1>
                  </div>
              </div>
              <Divider />
              <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={items} />
              </div>
          </Sider>


          <Layout>
              <Header style={{ padding: 0, background: colorBgContainer, height:  128,zIndex: 999}} className="sticky top-0" />
              <Content style={{ margin: '24px 16px 0' }}>
                  <div
                      style={{
                          padding: 24,
                          minHeight: 360,
                          background: colorBgContainer,
                          borderRadius: borderRadiusLG,
                      }}
                  >
                      {visibleComponent}
                      {visibleComponent === "Products" && <AllProducdts/>}
                  </div>
              </Content>
          </Layout>
      </Layout>
  );
}
