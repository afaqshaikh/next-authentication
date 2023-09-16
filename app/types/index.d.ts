export interface UserRequest {
    name: string,
    email: string,
    password: string
}

export interface UserData extends UserRequest {
    _id: string;
}