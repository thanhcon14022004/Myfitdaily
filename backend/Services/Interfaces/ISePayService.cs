namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public class SePayTransactionMatch
    {
        public string TransactionId { get; set; } = string.Empty;
        public decimal AmountIn { get; set; }
        public string TransactionContent { get; set; } = string.Empty;
        public DateTime? TransactionDate { get; set; }
        public string? BankBrandName { get; set; }
        public string? AccountNumber { get; set; }
    }

    public interface ISePayService
    {
        Task<SePayTransactionMatch?> FindMatchingTransactionAsync(string orderCode, decimal expectedAmount);
    }
}
