import { z } from 'zod';

const SchemaTeamCreation = z.object({
    letter: z
      .string()
      .length(1, { message: 'Must be exactly one letter' }) 
      .refine((value) => /^[a-zA-Z]+$/.test(value), { message: 'Must contain only letters' })
  });

  const SchemaTeamUpdate = z.object({
    letter: z
      .string()
      .length(1, { message: 'Must be exactly one letter' })
      .refine((value) => /^[a-zA-Z]+$/.test(value), { message: 'Must contain only letters' })
      .optional()
  });


  export function validateTeam(input, isCreation) {
    const schema = isCreation ? SchemaTeamCreation : SchemaTeamUpdate;
    const result = schema.safeParse(input);
  
    if (!result.success) {
      console.log('Validation errors:', result.error.errors);
    }
  
    return result;
  }