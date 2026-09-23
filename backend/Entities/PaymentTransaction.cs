using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class PaymentTransaction : BaseEntity
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string OrderCode { get; set; } = string.Empty; // Ví dụ: MFD198030

        [Required]
        [MaxLength(50)]
        public string PlanId { get; set; } = string.Empty; // Premium, PremiumPlus

        [Required]
        [MaxLength(20)]
        public string BillingCycle { get; set; } = "Monthly"; // Monthly, Yearly

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Pending"; // Pending, Success, Cancelled, Expired

        [MaxLength(100)]
        public string? SePayTransactionId { get; set; }

        public DateTime? PaidAt { get; set; }

        [MaxLength(50)]
        public string? BankBrandName { get; set; }

        [MaxLength(50)]
        public string? AccountNumber { get; set; }

        public string? TransactionContent { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
