using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public class MobileDevice : Asset
    {
        public MobileDevice()
        {
            Type = "mobile_device";
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
        public MobileDeviceType DeviceType { get; set; }

        [Required]
        [StringLength(100)]
        public string OperatingSystem { get; set; }

        [StringLength(15)]
        public string? Imei { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }
    }

    public enum MobileDeviceType
    {
        Smartphone,
        Tablet,
        Laptop,
        Other
    }

}
