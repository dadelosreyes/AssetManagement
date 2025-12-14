using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public abstract class Asset
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public AssetStatus Status { get; set; }

        [Required]
        [StringLength(200)]
        public string Location { get; set; }

        [StringLength(200)]
        public string? AssignedTo { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum AssetStatus
    {
        Active,
        Inactive,
        Maintenance
    }
}
