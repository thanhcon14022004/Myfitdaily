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

    public class CreatePaymentRequestDto
    {
        [Required]
        public string PlanId { get; set; } = string.Empty; // "Premium", "PremiumPlus"

        [Required]
        public string BillingCycle { get; set; } = "Monthly"; // "Monthly", "Yearly"
    }

    public class CreatePaymentResponseDto
    {
        public string OrderCode { get; set; } = string.Empty;
        public string PlanId { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public string BillingCycle { get; set; } = "Monthly";
        public decimal Amount { get; set; }
        public string BankName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string TransferContent { get; set; } = string.Empty;
        public string QrUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CheckPaymentResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Status { get; set; } = "Pending"; // "Pending", "Success"
        public string Message { get; set; } = string.Empty;
        public string? OrderCode { get; set; }
        public string? PlanId { get; set; }
        public DateTime? PaidAt { get; set; }
        public object? User { get; set; }
    }

    public class SePayWebhookDto
    {
        public long Id { get; set; }
        public string? Gateway { get; set; }
        public string? TransactionDate { get; set; }
        public string? AccountNumber { get; set; }
        public string? SubAccount { get; set; }
        public string? Code { get; set; }
        public string? Content { get; set; }
        public string? TransferType { get; set; }
        public decimal TransferAmount { get; set; }
        public decimal Accumulated { get; set; }
        public string? ReferenceCode { get; set; }
        public string? Description { get; set; }
    }
}
