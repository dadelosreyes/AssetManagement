using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public class IPAddress : Asset
    {
        public IPAddress()
        {
            Type = "ip_address";
        }

        [Required]
        [StringLength(15)]
        public string IpAddress { get; set; }

        [Required]
        [StringLength(15)]
        public string Subnet { get; set; }

        [StringLength(15)]
        public string? Gateway { get; set; }

        [StringLength(15)]
        public string? Dns { get; set; }

        [StringLength(50)]
        public string? Vlan { get; set; }

        [Required]
        public bool IsWlan { get; set; }
    }

}
