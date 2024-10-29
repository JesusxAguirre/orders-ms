import 'dotenv/config';

import * as joi from 'joi';


const envSchema = joi.object({
    PORT: joi.number().required(),

}).unknown(true);


const { error, value } = envSchema.validate(process.env,);
if (error) throw new Error('Config validation issue');

export const env = {
    port: value.PORT,
}

