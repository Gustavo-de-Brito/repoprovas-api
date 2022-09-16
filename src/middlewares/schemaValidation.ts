import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { unprocessableError } from '../utils/errorUtils';

function schemaValidation(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const { error } = schema.validate(body, { abortEarly: false });

    if(error) {
      const errors: string[] = error.details.map(err => err.message);
      throw unprocessableError(errors);
    }

    next();
  }

}

export default schemaValidation;