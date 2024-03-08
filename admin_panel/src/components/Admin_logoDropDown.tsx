"use client";
import React from 'react';
import {DownOutlined, UserOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Avatar, Dropdown, Space} from 'antd';

const items: MenuProps['items'] = [
    {
        label: <button>Log in</button>,
        key: '0',
    },
    {
        type: 'divider',
    } as any,
    {
        label: <button>Sign out</button>,
        key: '3',
    },
];
const AdminLogoDropDown = () => {
    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <button onClick={(e) => e.preventDefault()}>
                <Space>
                    Welcome, User <Avatar size={40} icon={<UserOutlined />} />
                    <DownOutlined />
                </Space>
            </button>
        </Dropdown>
    );
};

export default AdminLogoDropDown;