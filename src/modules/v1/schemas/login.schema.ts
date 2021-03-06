import { SomeJSONSchema } from "ajv/dist/types/json-schema";

const LoginSchema: SomeJSONSchema = {
    $id: "Login",
    type: 'object',
    properties: {
        email: { 
            type: 'string',
            description: 'Member email',
            format: 'email',
        },
        passw: { type: 'string', minLength: 6 }
    },
    required: ['email', 'passw'],
    additionalProperties: false,
}

export default LoginSchema;