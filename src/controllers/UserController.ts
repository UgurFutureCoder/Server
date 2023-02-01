import jwt  from 'jsonwebtoken';
import  bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import  {PrismaClient} from '@prisma/client'
import { SrvRecord } from 'dns';
const prisma = new PrismaClient()

let refreshTokens: string[] = [];

export const register = async (req: Request, res: Response) => {

    try {
        

        const getUser = await prisma.user.findUnique({
          where: {
            email: req.body.email
          }
        })
        if(getUser){
          return res.json({
            message: "данный пользователь уже существует"
          })
        }
  
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
  
        const result = await prisma.user.create({
          data: {
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: passwordHash
          }
        })
  
  
    
        const user = await prisma.user.findUnique({
          where: {
            email: req.body.email
          }
        })
  
        if(!user) return;

        const accessToken = jwt.sign({id: user.id},'mega123',{expiresIn: '15m'})

        res.json({
          ...result,
          accessToken
        })
      } catch (e) {
        console.log(e)
        res.status(500).json({
          message: 'Не удалось зарегистрироваться'
        })
      }
      }



      export const login = async (req: Request,res: Response) => {
        try {
          const isUser = await prisma.user.findUnique({
            where: {
              email: req.body.email
            }
          })
          if(!isUser){
            return res.status(404).json({
              message: 'Данный пользователь не найден'
            })
          }
      
          const isValidPass = await bcrypt.compare(req.body.password, isUser.passwordHash)
          if(!isValidPass){
            return res.status(404).json({
              message: 'Неверный логин или пароль'
            })
          }
          const accessToken = jwt.sign({id: isUser.id},'mega123',{expiresIn: '15m'})
          const refreshToken = jwt.sign({id: isUser.id},'rega123',{expiresIn: '30d'})
          refreshTokens.push(refreshToken)
          res.json({
            id: isUser.id,
                email: isUser.email,
                fullName: isUser.fullName,
                accessToken,
                refreshToken
          })
        } catch(e) {
          console.log(e)
            res.status(500).json({
              message: 'Не удалось авторизоваться'
            })
        }
      
      }

      export interface IRequest extends Request {
        userId?: number;
      }

      export const getMe = async (req: IRequest,res: Response) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: req.userId
            }
          })
          if(!user){
            return res.status(404).json({
              message: 'Пользователь не найден'
            })
          }
          res.json({
            id: user.id,
            email: user.email,
            fullName: user.fullName
          })
        } catch(e) {
          console.log(e)
        res.status(500).json({
          message: 'Нет доступа'
        })
        }
      }



export const refresh = (req: Request,res: Response) => {
    const refreshToken = req.body.token


    if(!refreshToken){
        return res.status(401).json("Вы не авторизованы!")
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json("Refresh токен не валидный")
    }

    jwt.verify(refreshToken, 'rega123', (err: any,user: any) => {
        err && console.log(err)
        refreshTokens = refreshTokens.filter(token => token !== refreshToken)
        
        const newAccesstoken = jwt.sign({id: user.id},'mega123',{expiresIn: '15m'})
        const newRefreshToken = jwt.sign({id: user.id},'rega123',{expiresIn: '30d'})

        refreshTokens.push(newRefreshToken)

        res.status(200).json({
            accessToken: newAccesstoken,
            refreshToken: newRefreshToken
        })
    })

    
}