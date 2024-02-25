import {ConfigProvider} from "antd";

export default function ConfigAnt({children}: {children: React.ReactNode}) {
    return <ConfigProvider theme={{
        token: {
            fontFamily: '',
            colorPrimary: '#ffa300'
        },
        components: {
            Pagination: {
                colorPrimary: '#fcb103',
                colorPrimaryHover: '#b59205',
                itemSize: 50,
                colorSplit: '#fcb103',
            },
            Modal: {
                titleFontSize: 20,
                titleColor: '#d18502',
            },
            Button: {
                defaultActiveColor: '#f2e63a',
            },
            Menu: {
                itemSelectedBg: '#fafa7d',
                itemSelectedColor: '#000000',
                activeBarWidth: 2,
            }
        },
    }}>
        {children}
    </ConfigProvider>
}