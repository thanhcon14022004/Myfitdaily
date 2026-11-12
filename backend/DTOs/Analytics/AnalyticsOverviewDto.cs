namespace MYFITDAILY_EXE201_Group6.DTOs.Analytics
{
    public class AnalyticsOverviewDto
    {
        public string Period { get; set; } = "7d";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        // Mốc đo lường bắt đầu từ 30/10/2026
        public string StartDate { get; set; } = "30/10/2026";
        public string CurrentDate { get; set; } = "10/11/2026";
        public int DaysCount { get; set; } = 12;
        public long TodayVisits { get; set; } = 2450;
        public long TodayVisitors { get; set; } = 480;
        public List<AnalyticsDailyTrafficDto> DailyTraffic { get; set; } = new();

        // KPI Thẻ Điểm Đo Lường Lượng Truy Cập
        public long TotalPageviews { get; set; }
        public double PageviewsGrowthPercent { get; set; }
        public long UniqueVisitors { get; set; }
        public double UniqueVisitorsGrowthPercent { get; set; }
        public long TotalSessions { get; set; }
        public double SessionsGrowthPercent { get; set; }
        public long AvgSessionDurationSeconds { get; set; }
        public double BounceRatePercent { get; set; }
        public long GoalConversions { get; set; }
        public double ConversionRatePercent { get; set; }
        public int RealtimeActiveVisitors { get; set; }

        // Biểu đồ chuỗi thời gian (Timeline Series)
        public List<AnalyticsTimelinePointDto> TimelineSeries { get; set; } = new();

        // Bảng 1: Các trang được xem nhiều nhất (Top Pages)
        public List<AnalyticsPageItemDto> TopPages { get; set; } = new();

        // Bảng 2: Kênh & Nguồn truy cập (Traffic Acquisition Channels)
        public List<AnalyticsTrafficSourceDto> TrafficSources { get; set; } = new();

        // Bảng 3: Thiết bị & Công nghệ
        public List<AnalyticsShareItemDto> DeviceBreakdown { get; set; } = new();
        public List<AnalyticsShareItemDto> OsBreakdown { get; set; } = new();
        public List<AnalyticsShareItemDto> BrowserBreakdown { get; set; } = new();

        // Bảng 4: Phân bổ địa lý theo Tỉnh/Thành Việt Nam
        public List<AnalyticsGeoItemDto> GeoDistribution { get; set; } = new();

        // Bảng 5: Phễu chuyển đổi hành vi (Conversion Funnel)
        public List<AnalyticsFunnelStepDto> ConversionFunnel { get; set; } = new();

        // Danh sách khách truy cập thời gian thực (Realtime detail)
        public List<AnalyticsRealtimeVisitorDto> RealtimeVisitors { get; set; } = new();
    }

    public class AnalyticsTimelinePointDto
    {
        public string Label { get; set; } = string.Empty; // "09:00" hoặc "03/11"
        public string FullDate { get; set; } = string.Empty;
        public long Pageviews { get; set; }
        public long UniqueVisitors { get; set; }
        public long Sessions { get; set; }
        public long Conversions { get; set; }
    }

    public class AnalyticsPageItemDto
    {
        public string Path { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public long Pageviews { get; set; }
        public double Percent { get; set; }
        public long AvgDurationSec { get; set; }
        public double BounceRate { get; set; }
    }

    public class AnalyticsTrafficSourceDto
    {
        public string Source { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
        public long Visitors { get; set; }
        public double Percent { get; set; }
        public long Conversions { get; set; }
        public double ConvRate { get; set; }
        public string BadgeColor { get; set; } = "#10B981";
    }

    public class AnalyticsShareItemDto
    {
        public string Name { get; set; } = string.Empty;
        public double Percent { get; set; }
        public long Count { get; set; }
        public string Color { get; set; } = "#10B981";
    }

    public class AnalyticsGeoItemDto
    {
        public string City { get; set; } = string.Empty;
        public long Visitors { get; set; }
        public double Percent { get; set; }
        public long VipConversions { get; set; }
    }

    public class AnalyticsFunnelStepDto
    {
        public int Step { get; set; }
        public string Name { get; set; } = string.Empty;
        public long Count { get; set; }
        public double ConversionRate { get; set; }
        public double DropoffRate { get; set; }
    }

    public class AnalyticsRealtimeVisitorDto
    {
        public string VisitorId { get; set; } = string.Empty;
        public string ActivePage { get; set; } = string.Empty;
        public string PageTitle { get; set; } = string.Empty;
        public string Device { get; set; } = "Mobile";
        public string City { get; set; } = "Hà Nội";
        public string Referrer { get; set; } = "Direct";
        public int ActiveMinutes { get; set; }
        public string UserEmail { get; set; } = string.Empty;
    }

    public class AnalyticsDailyTrafficDto
    {
        public string DateString { get; set; } = string.Empty; // "07/11/2026"
        public string DayOfWeek { get; set; } = string.Empty; // "Thứ Bảy"
        public long Pageviews { get; set; }
        public long UniqueVisitors { get; set; }
        public long Sessions { get; set; }
        public string GrowthNote { get; set; } = string.Empty;
        public bool IsToday { get; set; }
    }
}

