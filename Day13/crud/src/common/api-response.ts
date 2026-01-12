export class ApiResponse <T>{
    success: boolean;
    msg: string;
    data?: T;

    constructor(success: boolean, msg: string, data?: T){ 
        this.success = success;
        this.msg = msg;
        this.data = data;
    }
}