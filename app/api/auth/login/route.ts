import { findDataInDB } from '@/app/helpers/db';
import { UserData } from '@/app/types';
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
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

        const response = NextResponse.json({ "message": "Success" }, { status: 200 });

        response.cookies.set('authToken', token, {
            httpOnly: true
        });

        return response;

    } catch (error: any) {
        console.log(error.message);
    }



}