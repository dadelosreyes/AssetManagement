using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public class PC : Asset
    {
        public PC()
        {
            Type = "pc";
        }

        [Required]
        [StringLength(100)]
        public string SerialNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string Model { get; set; }

        [Required]
        [StringLength(100)]
        public string Manufacturer { get; set; }

        [Required]
        [StringLength(100)]
        public string OperatingSystem { get; set; }

        [Required]
        [StringLength(100)]
        public string Processor { get; set; }

        [Required]
        [StringLength(50)]
        public string Memory { get; set; }

        [Required]
        [StringLength(50)]
        public string Storage { get; set; }

        [StringLength(15)]
        public string? IpAddress { get; set; }
    }
}
