using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Data
{
    public class AssetManagementContext : DbContext
    {
        public AssetManagementContext (DbContextOptions<AssetManagementContext> options)
            : base(options)
        {
        }

        public DbSet<IPAddress> IPAddresses { get; set; }
        public DbSet<PC> PCs { get; set; }
        public DbSet<Peripheral> Peripherals { get; set; }
        public DbSet<NetworkDevice> NetworkDevices { get; set; }
        public DbSet<MobileDevice> MobileDevices { get; set; }
        public DbSet<Printer> Printers { get; set; }
        public DbSet<AssetType> AssetTypes { get; set; }
        public DbSet<AssetTypeField> AssetTypeFields { get; set; }
        public DbSet<CustomAsset> CustomAssets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table names
            modelBuilder.Entity<IPAddress>().ToTable("IPAddresses");
            modelBuilder.Entity<PC>().ToTable("PCs");
            modelBuilder.Entity<Peripheral>().ToTable("Peripherals");
            modelBuilder.Entity<NetworkDevice>().ToTable("NetworkDevices");
            modelBuilder.Entity<MobileDevice>().ToTable("MobileDevices");
            modelBuilder.Entity<Printer>().ToTable("Printers");
            modelBuilder.Entity<CustomAsset>().ToTable("CustomAssets");

            modelBuilder.Entity<AssetTypeField>()
                .Property(f => f.DataType)
                .HasConversion<string>();

            // Configure self-referencing relationship for Asset
            modelBuilder.Entity<Asset>()
                .HasOne(a => a.ParentAsset)
                .WithMany()
                .HasForeignKey(a => a.ParentAssetId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure dictionary as JSON
            modelBuilder.Entity<CustomAsset>()
                .Property(b => b.CustomProperties)
                .HasColumnType("nvarchar(max)")
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions)null)!
                );

            // Configure enum conversions to strings
            modelBuilder.Entity<Asset>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Peripheral>()
                .Property(p => p.PeripheralType)
                .HasConversion<string>();

            modelBuilder.Entity<NetworkDevice>()
                .Property(n => n.DeviceType)
                .HasConversion<string>();

            modelBuilder.Entity<MobileDevice>()
                .Property(m => m.DeviceType)
                .HasConversion<string>();

            modelBuilder.Entity<Printer>()
                .Property(p => p.PrinterType)
                .HasConversion<string>();

            // Add indexes for commonly searched fields
            modelBuilder.Entity<IPAddress>()
                .HasIndex(i => i.IpAddress);

            modelBuilder.Entity<PC>()
                .HasIndex(p => p.SerialNumber);

            modelBuilder.Entity<Peripheral>()
                .HasIndex(p => p.SerialNumber);

            modelBuilder.Entity<NetworkDevice>()
                .HasIndex(n => n.SerialNumber);

            modelBuilder.Entity<MobileDevice>()
                .HasIndex(m => m.SerialNumber);

            modelBuilder.Entity<Printer>()
                .HasIndex(p => p.SerialNumber);
        }
    }
}
