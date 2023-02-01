
import { Request, Response } from "express";
import  {PrismaClient} from '@prisma/client'
import { SrvRecord } from 'dns';
const prisma = new PrismaClient()


export const getProduct = async (req: Request,res: Response) => {
    const result = await prisma.product.findMany()
    
    res.json(result)
}