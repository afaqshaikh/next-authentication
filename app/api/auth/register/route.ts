import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto';
import { UserRequest, UserData } from '@/app/types';
import { findDataInDB, writeDataInDB } from '@/app/helpers/db';
import bcryptjs from 'bcryptjs'

export const POST = async (request: NextRequest) => {
    
    try {

        const userData: UserRequest = await request.json()
        // console.log(userData)

        const findUser: UserData | undefined = findDataInDB(userData.email)

        if (findUser) {
            return NextResponse.json({ "error": "User already registered"}, { status: 400 });
        }

        const salt: string = await bcryptjs.genSalt(10);

        const hashPassword: string = await bcryptjs.hash(userData.password, salt);

        // console.log(salt,hashPassword);
        

        const newUser: UserData = {
            _id: randomUUID(),
            name: userData.name,
            email: userData.email,
            password: hashPassword
        }
        // console.log(newUser)

        const response = writeDataInDB(newUser);

        if (response) {

            return NextResponse.json({
                "message": "User registration complete successfully 😅"
            }, {
                status: 201
            });
        }

    } catch (error:any) {
        
        return NextResponse.json({
            "message": error.message,
            "error": error
        }, {
            status: 500
        });
    }
}