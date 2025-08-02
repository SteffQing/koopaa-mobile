import { z } from 'zod'

export const ActivityTypeEnum = z.enum(['create', 'credit', 'debit', 'transfer'])

export const addActivitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().int().positive().optional(),
  type: ActivityTypeEnum,
  sig: z.string().optional(),
  group_pda: z.string().optional(),
})

export const addActivitySchemaForPayout = addActivitySchema.extend({
  recipient: z.string(),
})

export type AddActivityData = z.infer<typeof addActivitySchema>
export type AddActivityDataForPayout = z.infer<typeof addActivitySchemaForPayout>

export const createAjoGroupSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Group name must be at least 3 characters' })
    .max(50, { message: 'Group name must be less than 50 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(500, { message: 'Description must be less than 500 characters' }),
  security_deposit: z
    .number({ error: 'Security deposit is required' })
    .min(1, { message: 'Security deposit must be at least 1 USDC' }),
  max_participants: z
    .number({ error: 'Maximum participants is required' })
    .min(3, { message: 'At least 3 participants are required' })
    .max(20, { message: 'Maximum 20 participants allowed' }),
  contribution_amount: z
    .number({ error: 'Contribution amount is required' })
    .min(1, { message: 'Contribution amount must be at least 1 USDC' }),
  contribution_interval: z.enum(['1', '7', '30'], {
    error: 'Please select a contribution interval',
  }),
  payout_interval: z.enum(['7', '14', '30'], {
    error: 'Please select a payout interval',
  }),
  tag: z.enum(['real_estate', 'birthday', 'finance', 'lifestyle', 'education', 'travel'], {
    error: 'Please select a tag',
  }),
  group_cover_photo: z
    .number()
    .min(1, { message: 'Please select a cover photo' })
    .max(4, { message: 'Please select a cover photo' }),
})

export type CreateAjoGroupFormValues = z.infer<typeof createAjoGroupSchema>

export const createdAjoGroupSchema = createAjoGroupSchema
  .omit({
    contribution_amount: true,
    contribution_interval: true,
    max_participants: true,
    payout_interval: true,
  })
  .extend({
    pda: z.string().min(1, 'Ajo Group needs a PDA identifier'),
    signature: z.string().min(1, 'Transaction hash with which Group was created'),
  })

export const joinAjoGroupSchema = createdAjoGroupSchema.omit({
  description: true,
  group_cover_photo: true,
  tag: true,
})

export type CreatedAjoGroup = z.infer<typeof createdAjoGroupSchema>
export type JoinAjoGroup = z.infer<typeof joinAjoGroupSchema>
