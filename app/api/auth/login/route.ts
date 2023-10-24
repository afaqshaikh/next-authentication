import { findDataInDB } from '@/app/helpers/db';
import { UserData } from '@/app/types';
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { SignJWT } from 'jose';
import { log } from 'console';
import { Limiter } from '@/app/config/limiter';

export async function POST(request: NextRequest) {

    try {

        const remainingRequests = await Limiter.removeTokens(1);
        console.log(remainingRequests);

        if (remainingRequests < 0) {
            return NextResponse.json({ "error": "Too many requests" }, { status: 429 });
        }
        
        const userData = await request.json()

        const user: UserData | undefined = findDataInDB(userData.email);

        if (!user) {
            return NextResponse.json({ "error": "User is not registered" }, { status: 400 });
        }

        const passwordMatch: boolean = await bcryptjs.compare(userData.password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ "error": "Invalid Credentials" }, { status: 400 });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY as string, {
            expiresIn: "7d"
        });

        const secret = new TextEncoder().encode(process.env.SECRET_KEY as string)

        const joseToken = await new SignJWT({ _id: user._id }).setProtectedHeader({alg: "HS256"}).setExpirationTime('7d').setIssuedAt().sign(secret)

        const response = NextResponse.json({ "message": "Success",token:joseToken }, { status: 200 });

        response.cookies.set('authToken', joseToken, {
            httpOnly: true
        });

        return response;

    } catch (error: any) {
        console.log(error.message);
    }



}