using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.Services.Implementations;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình Database Context (PostgreSQL Supabase)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// 2. Đăng ký các Business Services vào DI Container
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAiStylistService, AiStylistService>();
builder.Services.AddSingleton<IFashionEcommerceTrendService, FashionEcommerceTrendService>();

// 3. Cấu hình JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "MyFitDailySuperSecretKey2026_EXE201Group6_MustBeLongEnoughForHmacSha256SecurityKey!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "MyFitDaily";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "MyFitDailyClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 4. Cấu hình CORS (Cho phép React frontend gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

// 5. Cấu hình Swagger OpenAPI hỗ trợ nút Authorize (JWT Bearer)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MYFITDAILY API",
        Version = "v1",
        Description = "Tài liệu API cho hệ sinh thái MYFITDAILY – Your Personal AI Stylist"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập JWT token vào đây (ví dụ: eyJhbGci...)"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MYFITDAILY API v1");
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Đảm bảo các cột thông số cơ thể tồn tại trong PostgreSQL Supabase
try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.ExecuteSqlRawAsync(@"
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Height"" double precision;
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Weight"" double precision;
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Chest"" double precision;
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Waist"" double precision;
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Hips"" double precision;
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""BodyShape"" character varying(50);
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Age"" integer;
        ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""AgeGroup"" character varying(50);
        ALTER TABLE ""ClothingItems"" ADD COLUMN IF NOT EXISTS ""Brand"" character varying(100);
        ALTER TABLE ""ClothingItems"" ADD COLUMN IF NOT EXISTS ""Size"" character varying(20);
        ALTER TABLE ""ClothingItems"" ALTER COLUMN ""ImageUrl"" TYPE text;
        ALTER TABLE ""ClothingItems"" ALTER COLUMN ""Description"" TYPE text;
    ");
}
catch (Exception ex)
{
    Console.WriteLine($"[DB Auto-Migration Warning]: {ex.Message}");
}

app.Run();

