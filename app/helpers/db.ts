// Import module from node
import path from 'path';
import fs from "fs";

// Import types
import { UserData } from '../types';

// Create database file path
const databaseFilePath = path.join(process.cwd(), "/app/database/db.json");


export const getDataFromDB = (): { users: UserData[] } => {
    try {
        const db = fs.readFileSync(databaseFilePath, "utf-8");

        const dataFromDB = JSON.parse(db);
        // console.log(dataFromDB);

        return dataFromDB;

    } catch (error: any) {
        throw new Error(error?.message);
    }
};


export const writeDataInDB = (newUserData: UserData) => {
    try {
        const currentDataFromDB = getDataFromDB();

        const newDataToInsertInDB = JSON.parse(JSON.stringify(currentDataFromDB));

        newDataToInsertInDB.users.push(newUserData);

        fs.writeFileSync(databaseFilePath, JSON.stringify(newDataToInsertInDB, null, 4))

        return true;

    } catch (error: any) {
        throw new Error(error?.message);
    }

}


export const findDataInDB = (fieldValue: string) => {
    try {
        const currentDataFromDB = getDataFromDB();

        return currentDataFromDB.users.find((user) => {
            if (user._id == fieldValue) return true;
            else if (user.name == fieldValue) return true;
            else if (user.email == fieldValue) return true;
            else return undefined;
        });

    } catch (error: any) {
        throw new Error(error?.message);
    }
}
