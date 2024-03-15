import {NextRequest, NextResponse} from 'next/server';
import {host, Endpoints} from "@/constants";
import { getCookie } from "cookies-next";
export async  function middleware(request: NextRequest) {
    const  accessToken   = request.cookies.get('access_token');
    const  refreshToken = request.cookies.get('refresh_token');
    await fetch(host + Endpoints.AdminIsValidAccesstoken, {body: JSON.stringify({accessToken: accessToken}) , method: "POST", headers: {'Content-Type': 'application/json'}})
        .then(response => {
            if(response.status !==200){
                return NextResponse.redirect('http://localhost:3001/signin')
            }

        })
    if (!refreshToken && request.nextUrl.pathname.startsWith('/dashboard')){
    return NextResponse.redirect('http://localhost:3001/signin')
    }
}