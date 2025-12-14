using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Models
{
    public class Peripheral : Asset
    {
        public Peripheral()
        {
            Type = "peripheral";
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
        public PeripheralType PeripheralType { get; set; }

        [StringLength(50)]
        public string? ConnectionType { get; set; }
    }

    public enum PeripheralType
    {
        Keyboard,
        Mouse,
        Monitor,
        Webcam,
        Headset,
        DockingStation,
        Other
    }


}
