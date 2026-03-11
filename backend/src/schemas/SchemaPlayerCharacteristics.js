import { z } from 'zod';

const validPositions = ['GK', 'CB', 'LB', 'RB', 'DM', 'CAM', 'RM', 'LM', 'AM', 'CF', 'LW', 'RW', 'ST'];
const validFoots = ['Left', 'Right'];

const SchemaPlayerCharacteristics = z.object({
  position1: z.enum(validPositions, {
    errorMap: () => ({ message: 'Position1 must be one of the following: ' + validPositions.join(', ') })
  }),
  position2: z.enum(validPositions, {
    errorMap: () => ({ message: 'Position2 must be one of the following: ' + validPositions.join(', ') })
  }),
  dominantFoot: z.enum(validFoots, {
    errorMap: () => ({ message: 'Dominant foot must be either "left" or "right"' })
  }),
  avgTechnicalLevel: z.number().min(0, { inclusive: true }).max(10, {
    errorMap: () => ({ message: 'Average technical level must be a number between 0 and 10' })
  }),
  avgTacticalLevel: z.number().min(0, { inclusive: true }).max(10, {
    errorMap: () => ({ message: 'Average tactical level must be a number between 0 and 10' })
  }),
  avgFatigue: z.number().min(0, { inclusive: true }).max(10, {
    errorMap: () => ({ message: 'Average fatigue must be a number between 0 and 10' })
  }),
  avgHeartRate: z.number().int().positive({
    errorMap: () => ({ message: 'Average heart rate must be a positive integer' })
  }),
  personalLifeLevel: z.number().min(0, { inclusive: true }).max(10, {
    errorMap: () => ({ message: 'Personal life level must be a number between 0 and 10' })
  }),
  drugUseLevel: z.number().min(0, { inclusive: true }).max(10, {
    errorMap: () => ({ message: 'Drug use level must be a number between 0 and 10' })
  }),
  allergies: z.array(z.string()).optional()
});

export function validatePlayerCharacteristics(input) {
  const result = SchemaPlayerCharacteristics.safeParse(input);

  if (!result.success) {
    console.log('Validation errors:', result.error.errors);
  }

  return result;
}