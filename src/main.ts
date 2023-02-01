import { getProduct } from './controllers/ProductController.js';
import { Response } from 'express';
import { Request } from 'express';
import express from 'express'
import { registerValidation, loginValidation } from "./validations/auth.js";
import handleValidationErrors from './utils/handleValidationErrors.js';
import * as UserController from './controllers/UserController.js'
import checkAuth from './utils/checkAuth.js';
import { refresh } from './controllers/UserController.js';
const app = express()


const PORT = process.env.PORT || 3002
app.use(express.json())

app.get('/test', (req: Request, res: Response) => {
    res.send({
        message: 'succes'
    })
})

app.post('/auth/login', loginValidation, handleValidationErrors,UserController.login)
app.post('/auth/register', registerValidation,handleValidationErrors,UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/refresh', refresh)
app.get('/product', getProduct)

const server = () => {
    try {
    app.listen(PORT, () => {
        console.log(`Succeseful connect on ${PORT} port`)
    })
    } catch (err){
        console.log('Неуспешно')
        console.log(err)
    }
}

server()