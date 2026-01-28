import { Request } from "express";

export const cookieExtractor = (req: any): string | null => {
    return req?.cookies?.token || null;
}