namespace MYFITDAILY_EXE201_Group6.DTOs.User
{
    public class HeartbeatDto
    {
        public int? UserId { get; set; }
        public string? Email { get; set; }
        public int Seconds { get; set; } = 10;
        public int? SessionSeconds { get; set; }
        public string? Feature { get; set; }
    }
}
