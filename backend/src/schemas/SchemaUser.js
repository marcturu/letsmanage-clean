import { z } from 'zod';

const stringSchema = z.string().min(2).max(15);

const prohibitedStings = ['hitler', 'franco', 'mussolini', 'admin', 'adminsitrator', 'system', 'test', 
                          'tester', 'user', 'username', 'null', 'undefined', 'forbbiden', 'god', 'killer',
                          'assassin', 'murderer', 'hitman', 'executioner', 'butchman', 'slayer', 'mercenary',
                          'fuck', 'fucker', 'shit', 'asshole', 'bastard', 'retard', 'moron', 'wanker', 'dumbass'];
const isNotProhibited = (value) => !prohibitedStings.includes(value.toLowerCase());

const SchemaUserRegister = z.object({
  username: stringSchema
  .refine(value => value.length > 0, { message: 'can not be null' })
  .refine(isNotProhibited, { message: 'is not allowed' }),
  name: stringSchema
  .refine(value => value.length > 0, { message: 'can not be null' })
  .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'must contain only letters' })
  .refine(isNotProhibited, { message: 'is not allowed' }),
  surname: stringSchema
    .refine(value => value.length > 0, { message: 'can not be null' })
    .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'must contain only letters' })
    .refine(isNotProhibited, { message: 'is not allowed' }),
  password: z.string().min(8).max(20).refine(value => value.length > 0, { message: 'can not be null' })
  
});

const SchemaUserLogin = z.object({
  username: stringSchema.refine(value => value.length > 0, { message: 'can not be null' }),
  password: z.string().min(8).max(20).refine(value => value.length > 0, { message: 'can not be null' }),
});

export function validateUserRegister(input) {
  const result = SchemaUserRegister.safeParse(input);

  if (!result.success) {
    console.log('Validation errors:', result.error.errors);
  }

  return result;
}

export function validateUserLogin(input) {
  const result = SchemaUserLogin.safeParse(input);

  if (!result.success) {
    console.log('Validation errors:', result.error.errors);
  }

  return result;
}