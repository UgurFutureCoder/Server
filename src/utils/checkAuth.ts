import  jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface IRequest extends Request {
    userId?: Record<string, string>;
  }
  
  export interface IJwtPayload extends JwtPayload{
    id?:  string;
  }

  export default (req: IRequest, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')


    if(token) {
        try {
            const decoded  = jwt.verify(token,'mega123')

        
            req.userId = (decoded as JwtPayload).id
            next()
        } catch(e) {
            console.log(e)
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
} 


