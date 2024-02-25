'use client'
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import {ConfigProvider, Layout, Menu, theme} from 'antd';
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
import { Comfortaa } from '@next/font/google';
import TetList from "@/components/testlist";
import './globals.css'
import useWindowDimensions from "@/hook/useWindowDimensions";
import {CountSiderWidth} from "@/utils/CountSiderWidth";
const confortaa = Comfortaa({
    subsets: ["latin","cyrillic","cyrillic-ext"],
});
const { Header, Content, Footer, Sider } = Layout;

export default function Home() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  return (
      <main className={confortaa.className}>
      </main>
  );
}
