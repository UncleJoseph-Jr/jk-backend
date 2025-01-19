export interface RegisterResponse {
    message: string;
    user: {
        id:number;
        name: string;
        email: string,
        role: string,
        status: string;
        createAt: Date;
    }
}