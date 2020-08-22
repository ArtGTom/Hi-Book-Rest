export interface User {
    cd_user: number,
    nm_user: string,
    nm_username: string,
    nm_email_user: string,
    ds_biography: string,
    cd_phone_number: string,
    cd_user_icon_URL: string
}    

export interface CreateUser {
    user: string,
    username: string,
    email: string,
    password: string,
    biography: string,
}