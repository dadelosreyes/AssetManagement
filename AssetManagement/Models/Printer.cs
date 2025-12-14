using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public class Printer : Asset
    {
        public Printer()
        {
            Type = "printer";
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
        public PrinterType PrinterType { get; set; }

        [StringLength(15)]
        public string? IpAddress { get; set; }

        public bool IsNetworked { get; set; }
    }

    public enum PrinterType
    {
        Laser,
        Inkjet,
        Thermal,
        DotMatrix,
        Multifunction,
        Other
    }

}
