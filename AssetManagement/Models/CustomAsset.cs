using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetManagement.Models
{
    public class CustomAsset : Asset
    {
        [Required]
        public string AssetTypeId { get; set; }

        public AssetType? AssetType { get; set; }

        public string? IpAddress { get; set; }

        // Mapped to a JSON column in DB
        public Dictionary<string, string> CustomProperties { get; set; } = new Dictionary<string, string>();
    }
}
