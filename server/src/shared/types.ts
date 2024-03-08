export type Tokens = {
    access_token: string;
    refresh_token: string;
};

export type Admin_JWT_Payload = {
    id: string,
    name: string,
}
export type with_refresh_Admin_JWT_Payload= Admin_JWT_Payload & {refreshToken: string};
