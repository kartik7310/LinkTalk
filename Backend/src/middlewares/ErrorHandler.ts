import { Request,Response,NextFunction } from "express";
import logger from "../utils/logger.js";

interface TypeError extends Error{
  statusCode?:number
}

function errorHandler(err:TypeError,req:Request,res:Response,next:NextFunction){
  const statusCode = err.statusCode || 500;
  const message = err.message ||"Internal server Error"
  logger.error(`[ERROR] ${req.method} ${req.path} -> ${message}`);
  res.status(statusCode).json({
    success:false,
    message,
  })

}
export default errorHandler;