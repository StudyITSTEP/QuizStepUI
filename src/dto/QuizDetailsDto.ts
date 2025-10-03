export type QuizDetailsDto = {
    id: number
    name: string
    description: string
    totalQuestions: number
    creatorName: string
    creatorEmail: string
    creatorId: string
    totalParticipants: number
    access: number
    accessCode?: number | null
    averageScore: number
    categoryId: number
}