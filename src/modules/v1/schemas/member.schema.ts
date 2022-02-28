import { SomeJSONSchema } from "ajv/dist/types/json-schema";

const MemberSchema: SomeJSONSchema = {
    $id: "Member",
    type: 'object',
    properties: {
        firstName: { 
            type: 'string',
            description: 'Member first name',
            maxLength: 80,
            minLength: 1,
        },
        lastName: { 
            type: 'string',
            description: 'Member last name',
            maxLength: 80,
            minLength: 1,
        },
        email: { 
            type: 'string',
            description: 'Member email',
            format: 'email',
            maxLength: 80,
            minLength: 1,
        },
        passw: { 
            type: 'string',
            description: 'Member password',
            maxLength: 80,
            minLength: 6,
        },
        classCompletionDate: {
            type: 'string',
            description: 'Member class completion date',
            format: 'date'
        },
        skills: {
            type: 'array',
            description: 'Member skills',
            minItems: 1,
            items: {
                type: 'string',
                minLength: 1,
            }
        },
        role: {
            type: 'string',
            description: 'Member role',
            enum: ['admin', 'standard']
        }
    },
    required: ['firstName', 'lastName', 'email', 'passw', 'classCompletionDate', 'skills', 'role'],
    additionalProperties: false,
}

export default MemberSchema;