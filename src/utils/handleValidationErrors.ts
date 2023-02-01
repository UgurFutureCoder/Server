import { NextFunction } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { validationResult } from "express-validator";

const handleErr =  (req: Request,res: Response,next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() })
      return res.status(400).json({ errors: errors.array() });
      
    }

next()
}

export default handleErr