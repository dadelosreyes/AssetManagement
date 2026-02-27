using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AssetManagement.Models
{
    public class AssetTypeField
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string? AssetTypeId { get; set; }

        [JsonIgnore]
        public AssetType? AssetType { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public FieldDataType DataType { get; set; }

        public bool IsRequired { get; set; } = false;

        public int DisplayOrder { get; set; } = 0;
    }

    public enum FieldDataType
    {
        Text,
        Number,
        Date,
        Boolean
    }
}
