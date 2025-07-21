interface User {
  address: string
  username?: string | null
  avatar: number
  email?: string | null
  activities: Activity[]
  groups: Group[]
}

interface Group {
  pda: string
  name: string
  created_at: Date
  description: string
  tag: Tag
  cover_photo: number
  participants: User[]
}

interface Activity {
  id: string
  title: string
  amount?: number | null
  type: ActivityType
  sig?: string | null
  created_at: Date
  userId: string
  group_pda?: string | null
  User: User
}
