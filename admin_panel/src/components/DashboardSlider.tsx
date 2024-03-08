"use client"
import React from 'react';
import {CountSiderWidth} from "@/utils/CountSiderWidth";
import Image from "next/image";
import LogoText from "../../public/logo-normalna.svg";
import DashboardImage from "../../public/layer groupdashboard.svg";
import {Divider, Menu, theme} from "antd";
import Sider from "antd/es/layout/Sider";
import useWindowDimensions from "@/hook/useWindowDimensions";
import {MenuItemType} from "antd/es/menu/hooks/useItems";

const DashboardSlider = ({items}:{items:MenuItemType[] }) => {
    const { height, width } = useWindowDimensions();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
            <Sider collapsible width={CountSiderWidth(width)} style={{ background: colorBgContainer , height: "100%", position: "fixed", zIndex: 999, top: 0, left: 0, backgroundColor: "#fff7ec"}}
                   breakpoint="lg"
                   collapsedWidth="0"
            >
                <div className="h-28 w-full flex flex-col" style={{paddingLeft:24}}>
                    <div className="bg-amber-300 rounded-2xl p-2 w-2/3 h-1/2 flex justify-center" style={{marginTop:20}}>
                        <Image src={LogoText} style={{objectFit:"contain"}}  alt="svg logo text"></Image>
                    </div>
                    <div className="flex flex-row  mt-7 h-1/2">
                        <Image src={DashboardImage} objectFit="contain" alt={"dashboard"}/>
                        <h1 className=" font-bold text-lg flex items-center justify-center h-full text-center text-amber-500 text-[100%]">Dashboard</h1>
                    </div>
                </div>
                <Divider />
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} items={items} />
            </Sider>
    );
};

export default DashboardSlider;