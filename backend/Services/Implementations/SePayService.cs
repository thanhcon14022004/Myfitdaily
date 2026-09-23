using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class SePayService : ISePayService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<SePayService> _logger;

        public SePayService(HttpClient httpClient, IConfiguration configuration, ILogger<SePayService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<SePayTransactionMatch?> FindMatchingTransactionAsync(string orderCode, decimal expectedAmount)
        {
            var apiToken = _configuration["SePay:ApiToken"];
            if (string.IsNullOrWhiteSpace(apiToken))
            {
                _logger.LogWarning("[SePayService]: SePay:ApiToken is not configured in appsettings.json.");
                return null;
            }

            try
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, "https://my.sepay.vn/userapi/transactions/list?limit=25");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("[SePayService]: Failed to fetch transactions from SePay API. Status: {StatusCode}", response.StatusCode);
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var result = JsonSerializer.Deserialize<SePayApiResponse>(json, options);
                if (result?.Transactions == null || result.Transactions.Count == 0)
                {
                    return null;
                }

                var cleanOrderCode = orderCode.Trim();

                foreach (var tx in result.Transactions)
                {
                    // Parse amount_in
                    if (!decimal.TryParse(tx.AmountIn, NumberStyles.Any, CultureInfo.InvariantCulture, out var amountIn))
                    {
                        continue;
                    }

                    // Must be incoming transfer of at least the required amount
                    if (amountIn < expectedAmount)
                    {
                        continue;
                    }

                    // Check if transaction_content or code contains our OrderCode
                    bool isContentMatch = !string.IsNullOrEmpty(tx.TransactionContent) &&
                                          tx.TransactionContent.Contains(cleanOrderCode, StringComparison.OrdinalIgnoreCase);

                    bool isCodeMatch = !string.IsNullOrEmpty(tx.Code) &&
                                       tx.Code.Contains(cleanOrderCode, StringComparison.OrdinalIgnoreCase);

                    if (isContentMatch || isCodeMatch)
                    {
                        DateTime? parsedDate = null;
                        if (!string.IsNullOrEmpty(tx.TransactionDate) &&
                            DateTime.TryParse(tx.TransactionDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
                        {
                            parsedDate = DateTime.SpecifyKind(dt, DateTimeKind.Utc);
                        }

                        _logger.LogInformation("[SePayService]: Found matching transaction ID {TxId} for OrderCode {OrderCode}, Amount: {Amount}",
                            tx.Id, cleanOrderCode, amountIn);

                        return new SePayTransactionMatch
                        {
                            TransactionId = tx.Id ?? Guid.NewGuid().ToString("N"),
                            AmountIn = amountIn,
                            TransactionContent = tx.TransactionContent ?? string.Empty,
                            TransactionDate = parsedDate ?? DateTime.UtcNow,
                            BankBrandName = tx.BankBrandName,
                            AccountNumber = tx.AccountNumber
                        };
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SePayService]: Error while querying SePay transactions for OrderCode {OrderCode}", orderCode);
                return null;
            }
        }

        private class SePayApiResponse
        {
            [JsonPropertyName("status")]
            public int Status { get; set; }

            [JsonPropertyName("transactions")]
            public List<SePayTransactionItem>? Transactions { get; set; }
        }

        private class SePayTransactionItem
        {
            [JsonPropertyName("id")]
            public string? Id { get; set; }

            [JsonPropertyName("bank_brand_name")]
            public string? BankBrandName { get; set; }

            [JsonPropertyName("account_number")]
            public string? AccountNumber { get; set; }

            [JsonPropertyName("transaction_date")]
            public string? TransactionDate { get; set; }

            [JsonPropertyName("amount_in")]
            public string? AmountIn { get; set; }

            [JsonPropertyName("amount_out")]
            public string? AmountOut { get; set; }

            [JsonPropertyName("transaction_content")]
            public string? TransactionContent { get; set; }

            [JsonPropertyName("code")]
            public string? Code { get; set; }
        }
    }
}
