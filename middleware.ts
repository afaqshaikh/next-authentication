import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { jwtVerify } from 'jose'


export const middleware = async (request: NextRequest) => {

    // console.log('middleware invoked');

    if (request.cookies.has('authToken')) {


        let token = request.cookies.get('authToken')?.value;

        try {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY as string)

            const { payload } = await jwtVerify(token, secret)
            console.log(payload);

        } catch (error) {
            return NextResponse.json({ "message": "Invalid token" })
        }

        // // we get error here 
        // const data = jwt.verify(token as string, process.env.SECRET_KEY as string);

    } else {
        return NextResponse.json({ "message": "Token not found" })
    }

}


export const config = {
    matcher: [
        '/api/profile/:path*',
    ],

}