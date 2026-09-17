using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Subscription
{
    public class SubscriptionPlanDto
    {
        public string Id { get; set; } = string.Empty; // "Free", "Premium", "PremiumPlus"
        public string Name { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public decimal YearlyPrice { get; set; }
        public string Currency { get; set; } = "VNĐ";
        public int MaxClothes { get; set; } // -1 for unlimited
        public int MaxDailyAiRecommendations { get; set; } // -1 for unlimited
        public string TargetSegment { get; set; } = string.Empty;
        public List<string> Features { get; set; } = new();
        public string? HighlightBadge { get; set; }
        public bool IsPopular { get; set; }
    }

    public class UpgradeSubscriptionRequestDto
    {
        [Required]
        public string PlanId { get; set; } = string.Empty; // "Free", "Premium", "PremiumPlus"

        [Required]
        public string BillingCycle { get; set; } = "Monthly"; // "Monthly", "Yearly"

        public string PaymentMethod { get; set; } = "VietQR"; // "VietQR", "MoMo", "MockDirect"
    }

    public class SubscriptionStatusDto
    {
        public string SubscriptionType { get; set; } = "Free";
        public string? SubscriptionPeriod { get; set; }
        public DateTime? SubscriptionExpiresAt { get; set; }
        public int CurrentClothesCount { get; set; }
        public int MaxClothes { get; set; }
        public int TodayAiCount { get; set; }
        public int MaxDailyAiRecommendations { get; set; }
        public string TargetSegment { get; set; } = string.Empty;
        public List<string> CurrentFeatures { get; set; } = new();
        public bool IsExpired { get; set; }
    }
}
