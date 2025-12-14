using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public class NetworkDevice : Asset
    {
        public NetworkDevice()
        {
            Type = "network_device";
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
        public NetworkDeviceType DeviceType { get; set; }

        [StringLength(15)]
        public string? IpAddress { get; set; }

        [StringLength(17)]
        public string? MacAddress { get; set; }

        public int? PortCount { get; set; }
    }

    public enum NetworkDeviceType
    {
        Router,
        Switch,
        AccessPoint,
        Firewall,
        Modem,
        Other
    }
}
