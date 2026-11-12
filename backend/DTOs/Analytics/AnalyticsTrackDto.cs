namespace MYFITDAILY_EXE201_Group6.DTOs.Analytics
{
    public class AnalyticsTrackDto
    {
        public string EventType { get; set; } = "page_view"; // "page_view", "custom_event", "session_ping"
        public string PageKey { get; set; } = "landing";     // "landing", "ai-stylist", "wardrobe", "outfits", "premium", "dashboard", "admin"
        public string? PageTitle { get; set; }
        public string? VisitorId { get; set; }
        public string? SessionId { get; set; }
        public string? Referrer { get; set; }
        public string? DeviceType { get; set; }               // "mobile", "desktop", "tablet"
        public string? OperatingSystem { get; set; }          // "iOS", "Android", "Windows", "macOS"
        public string? Browser { get; set; }                  // "Chrome", "Safari", "Edge", "CocCoc"
        public string? ScreenResolution { get; set; }
        public string? City { get; set; }
        public int DurationSeconds { get; set; } = 5;
        public string? EventName { get; set; }                // e.g. "try_on_click", "add_item", "upgrade_vip"
        public string? EventPropertiesJson { get; set; }
        public int? UserId { get; set; }
        public string? UserEmail { get; set; }
    }
}

