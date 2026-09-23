using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Entities;

namespace MYFITDAILY_EXE201_Group6.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<ClothingItem> ClothingItems => Set<ClothingItem>();
        public DbSet<Outfit> Outfits => Set<Outfit>();
        public DbSet<OutfitItem> OutfitItems => Set<OutfitItem>();
        public DbSet<AiStylistHistory> AiStylistHistories => Set<AiStylistHistory>();
        public DbSet<PaymentTransaction> PaymentTransactions => Set<PaymentTransaction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PaymentTransaction configuration
            modelBuilder.Entity<PaymentTransaction>(entity =>
            {
                entity.HasIndex(p => p.OrderCode).IsUnique();
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(c => c.Name).IsUnique();
            });

            // ClothingItem configuration
            modelBuilder.Entity<ClothingItem>(entity =>
            {
                entity.HasOne(c => c.User)
                      .WithMany(u => u.ClothingItems)
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.Category)
                      .WithMany(cat => cat.ClothingItems)
                      .HasForeignKey(c => c.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Outfit configuration
            modelBuilder.Entity<Outfit>(entity =>
            {
                entity.HasOne(o => o.User)
                      .WithMany(u => u.Outfits)
                      .HasForeignKey(o => o.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OutfitItem configuration
            modelBuilder.Entity<OutfitItem>(entity =>
            {
                entity.HasOne(oi => oi.Outfit)
                      .WithMany(o => o.OutfitItems)
                      .HasForeignKey(oi => oi.OutfitId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(oi => oi.ClothingItem)
                      .WithMany(ci => ci.OutfitItems)
                      .HasForeignKey(oi => oi.ClothingItemId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // AiStylistHistory configuration
            modelBuilder.Entity<AiStylistHistory>(entity =>
            {
                entity.HasOne(h => h.User)
                      .WithMany(u => u.AiStylistHistories)
                      .HasForeignKey(h => h.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed Categories
            var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Tops", Description = "Áo thun, sơ mi, áo len, croptop", DisplayOrder = 1, IsActive = true, CreatedAt = seedDate },
                new Category { Id = 2, Name = "Bottoms", Description = "Quần jeans, quần tây, chân váy, quần short", DisplayOrder = 2, IsActive = true, CreatedAt = seedDate },
                new Category { Id = 3, Name = "Dresses", Description = "Đầm liền thân, váy dài", DisplayOrder = 3, IsActive = true, CreatedAt = seedDate },
                new Category { Id = 4, Name = "Outerwear", Description = "Áo khoác, blazer, cardigan, hoodie", DisplayOrder = 4, IsActive = true, CreatedAt = seedDate },
                new Category { Id = 5, Name = "Shoes", Description = "Sneakers, giày tây, cao gót, sandals, boots", DisplayOrder = 5, IsActive = true, CreatedAt = seedDate },
                new Category { Id = 6, Name = "Accessories", Description = "Túi xách, thắt lưng, mũ nón, trang sức", DisplayOrder = 6, IsActive = true, CreatedAt = seedDate }
            );
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
