import { z } from 'zod';

const SchemaPlayerStats = z.object({
  timePlayed: z.number().min(0, {
    errorMap: () => ({ message: 'Time played must be a number greater than or equal to 0' })
  }),
  goals: z.number().min(0, {
    errorMap: () => ({ message: 'Goals must be a number greater than or equal to 0' })
  }),
  assists: z.number().min(0, {
    errorMap: () => ({ message: 'Assists must be a number greater than or equal to 0' })
  }),
  shots: z.number().min(0, {
    errorMap: () => ({ message: 'Shots must be a number greater than or equal to 0' })
  }),
  shotsOnTarget: z.number().min(0, {
    errorMap: () => ({ message: 'Shots on target must be a number greater than or equal to 0' })
  }),
  yellowCards: z.number().min(0).max(2, {
    errorMap: () => ({ message: 'Yellow cards must be between 0 and 2' })
  }),
  redCards: z.number().min(0).max(1, {
    errorMap: () => ({ message: 'Red cards must be between 0 and 1' })
  }),
}).refine(data => {
  if (data.yellowCards === 2 && data.redCards !== 1) {
    return false;
  }
  return true;
}, {
  message: 'If yellow cards are 2, red cards must be 1',
  path: ['redCards'], 
});

// Función de validación
export function validatePlayerStats(input) {
  const result = SchemaPlayerStats.safeParse(input);

  if (!result.success) {
    console.log('Validation errors:', result.error.errors);
  }

  return result;
}
