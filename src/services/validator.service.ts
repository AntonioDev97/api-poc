import Ajv, { ErrorObject } from 'ajv';
import { SomeJSONSchema } from 'ajv/dist/types/json-schema';
import addFormats from 'ajv-formats';
import { Logger } from './winston.service';

export interface IValidateResponse {
    success: boolean,
    errors: ErrorObject[]
}

const ValidateSchema = (params: Object, schema: SomeJSONSchema) => {
    const Response: IValidateResponse = { success: false, errors: [] };
    try {
        Logger.info(`Start step - Validate input parameters <${schema.$id}>`);
        const AJV = new Ajv();
        addFormats(AJV);
        const validate = AJV.compile(schema);
        const valid = validate(params);
        if (valid) Response.success = true;
        else Response.errors = validate.errors!;
        Logger.info(`End step - Validate input parameters <${schema.$id}> - Response: ${JSON.stringify(Response)}`);
    } catch (error) {
        Logger.error(`Error - ValidateSchema ${schema.$id}`, error);
        Response.success = false;
    }
    return Response;
};

export default ValidateSchema;