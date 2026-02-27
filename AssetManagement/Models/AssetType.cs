using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AssetManagement.Models
{
    public class AssetType
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsCustom { get; set; } = true;

        public bool RequiresIpAddress { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<AssetTypeField> Fields { get; set; } = new List<AssetTypeField>();
    }
}
