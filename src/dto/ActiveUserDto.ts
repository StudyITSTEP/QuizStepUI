export type ActiveUserDto = {
    userId: string;
    fullName: string;
    email: string;
    currentQuestion: number;
    onPage: boolean;
    totalQuestions: number;

}


// public string UserId { get; set; }
// public string? Email { get; set; }
// public string? FullName { get; set; }
// public int CurrentQuestion { get; set; }
// public bool OnPage { get; set; }