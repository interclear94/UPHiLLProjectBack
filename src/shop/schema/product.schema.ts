import { z } from 'zod'
export const productInfoSchema = z.object({
    name: z.string(),
    price: z.number(),
    dscr: z.string().nullable(),
    type: z.string(),
})