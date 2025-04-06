import { NextFunction, Request, Response } from "express";



export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
        status:"error",
        message: err.message || "Internal Server Error"
    }) 
}