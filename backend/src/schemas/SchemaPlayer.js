import { z } from 'zod';

const stringSchema = z.string().min(2).max(15);

const prohibitedStrings = [
  'hitler', 'franco', 'mussolini', 'admin', 'administrator', 'system', 'test', 
  'tester', 'user', 'username', 'null', 'undefined', 'forbidden', 'god', 'killer',
  'assassin', 'murderer', 'hitman', 'executioner', 'butcher', 'slayer', 'mercenary',
  'fuck', 'fucker', 'shit', 'asshole', 'bastard', 'retard', 'moron', 'wanker', 'dumbass'
];
const isNotProhibited = (value) => !prohibitedStrings.includes(value.toLowerCase());

const nameSchema = stringSchema
  .refine(value => value.length > 0, { message: 'can not be null' })
  .refine(value => /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/.test(value), { message: 'must contain only letters' })
  .refine(isNotProhibited, { message: 'is not allowed' });

const surnameSchema = stringSchema
  .refine(value => value.length > 0, { message: 'can not be null' })
  .refine(value => /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/.test(value), { message: 'must contain only letters' })
  .refine(isNotProhibited, { message: 'is not allowed' });

const surname2Schema = stringSchema
  .refine(value => value.length > 0, { message: 'can not be null' })
  .refine(value => /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/.test(value), { message: 'must contain only letters' })
  .refine(isNotProhibited, { message: 'is not allowed' });

const commonSchema = {
  height: z.number().optional().nullable(),
  weight: z.number().optional().nullable(), 
  phone: z.string()
    .optional()
    .nullable()
    .refine(value => !value || /^[0-9]{9}$/.test(value), {
      message: 'must be a valid phone number with exactly 9 digits',
    }),
  mail: z.string().email().optional().nullable(),
  DNI: z.string()
    .optional()
    .refine(value => !value || /^[0-9]{8}[A-Za-z]$/.test(value), { message: 'must be a valid DNI format (8 digits followed by 1 letter)' })
    .nullable(),
  birthdate: z.string()
    .optional()
    .refine(value => {
      if (!value) return true; 
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(value)) {
        return false; 
      }
      const [day, month, year] = value.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      return date <= new Date();
    }, { message: 'birthdate must be in the format DD/MM/YYYY and be in the past' }),
  nationality: z.string().optional().refine(value => /^[a-zA-Z]+$/.test(value), { message: 'must contain only letters' }),
  number: z.number().optional().nullable() 
};

function getPlayerSchema(creation) {
  if (creation) {
    return z.object({
      name: nameSchema,
      surname: surnameSchema,
      surname2: surname2Schema,
      ...commonSchema
    });
  } else {
    return z.object(commonSchema);
  }
}

export function validatePlayer(input, creation) {
  if (input.number) {
    input.number = Number(input.number);
  }

  const SchemaPlayer = getPlayerSchema(creation);
  const result = SchemaPlayer.safeParse(input);

  if (!result.success) {
    console.log('Validation errors:', result.error.errors);
  }

  return result;
}
