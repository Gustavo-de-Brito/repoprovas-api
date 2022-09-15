import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

function schemaValidation(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const { error } = schema.validate(body, { abortEarly: false });

    if(error) {
      const errors: string[] = error.details.map(err => err.message);

      return res.status(422).send(errors);
    }

    next();
  }

}

export default schemaValidation;