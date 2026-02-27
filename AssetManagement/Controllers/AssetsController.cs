using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AssetsController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public AssetsController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/Assets
        // Get all assets from all tables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllAssets(
            [FromQuery] string? type = null,
            [FromQuery] string? status = null,
            [FromQuery] string? search = null)
        {
            var allAssets = new List<object>();

            // Filter by type if specified
            if (type == null || type == "ip_address")
            {
                var ipAddresses = await _context.IPAddresses.ToListAsync();
                allAssets.AddRange(ipAddresses);
            }

            if (type == null || type == "pc")
            {
                var pcs = await _context.PCs.ToListAsync();
                allAssets.AddRange(pcs);
            }

            if (type == null || type == "peripheral")
            {
                var peripherals = await _context.Peripherals.ToListAsync();
                allAssets.AddRange(peripherals);
            }

            if (type == null || type == "network_device")
            {
                var networkDevices = await _context.NetworkDevices.ToListAsync();
                allAssets.AddRange(networkDevices);
            }

            if (type == null || type == "mobile_device")
            {
                var mobileDevices = await _context.MobileDevices.ToListAsync();
                allAssets.AddRange(mobileDevices);
            }

            if (type == null || type == "printer")
            {
                var printers = await _context.Printers.ToListAsync();
                allAssets.AddRange(printers);
            }

            if (type == null || type.StartsWith("custom_"))
            {
                var customAssetsQuery = _context.CustomAssets.AsQueryable();
                if (type != null) 
                {
                    var typeId = type.Substring(7);
                    customAssetsQuery = customAssetsQuery.Where(c => c.AssetTypeId == typeId);
                }
                var customAssets = await customAssetsQuery.ToListAsync();
                allAssets.AddRange(customAssets);
            }

            // Filter by status if specified
            if (!string.IsNullOrEmpty(status))
            {
                allAssets = allAssets.Where(a =>
                {
                    var assetObj = a as Asset;
                    return assetObj != null && assetObj.Status.ToString().ToLower() == status.ToLower();
                }).ToList();
            }

            // Filter by search term if specified
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                allAssets = allAssets.Where(a =>
                {
                    var assetObj = a as Asset;
                    if (assetObj == null) return false;

                    return assetObj.Name.ToLower().Contains(search) ||
                           assetObj.Location.ToLower().Contains(search) ||
                           (assetObj.AssignedTo?.ToLower().Contains(search) ?? false);
                }).ToList();
            }

            return Ok(allAssets);
        }

        // GET: api/Assets/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            var ipAddressCount = await _context.IPAddresses.CountAsync();
            var pcCount = await _context.PCs.CountAsync();
            var peripheralCount = await _context.Peripherals.CountAsync();
            var networkDeviceCount = await _context.NetworkDevices.CountAsync();
            var mobileDeviceCount = await _context.MobileDevices.CountAsync();
            var printerCount = await _context.Printers.CountAsync();
            var customAssetCount = await _context.CustomAssets.CountAsync();

            var totalAssets = ipAddressCount + pcCount + peripheralCount +
                            networkDeviceCount + mobileDeviceCount + printerCount + customAssetCount;

            // Count by status (approximate - you may want to refine this)
            var activeCount =
                await _context.IPAddresses.CountAsync(a => a.Status == AssetStatus.Active) +
                await _context.PCs.CountAsync(a => a.Status == AssetStatus.Active) +
                await _context.Peripherals.CountAsync(a => a.Status == AssetStatus.Active) +
                await _context.NetworkDevices.CountAsync(a => a.Status == AssetStatus.Active) +
                await _context.MobileDevices.CountAsync(a => a.Status == AssetStatus.Active) +
                await _context.Printers.CountAsync(a => a.Status == AssetStatus.Active) +
                await _context.CustomAssets.CountAsync(a => a.Status == AssetStatus.Active);

            var inactiveCount =
                await _context.IPAddresses.CountAsync(a => a.Status == AssetStatus.Inactive) +
                await _context.PCs.CountAsync(a => a.Status == AssetStatus.Inactive) +
                await _context.Peripherals.CountAsync(a => a.Status == AssetStatus.Inactive) +
                await _context.NetworkDevices.CountAsync(a => a.Status == AssetStatus.Inactive) +
                await _context.MobileDevices.CountAsync(a => a.Status == AssetStatus.Inactive) +
                await _context.Printers.CountAsync(a => a.Status == AssetStatus.Inactive) +
                await _context.CustomAssets.CountAsync(a => a.Status == AssetStatus.Inactive);

            var maintenanceCount =
                await _context.IPAddresses.CountAsync(a => a.Status == AssetStatus.Maintenance) +
                await _context.PCs.CountAsync(a => a.Status == AssetStatus.Maintenance) +
                await _context.Peripherals.CountAsync(a => a.Status == AssetStatus.Maintenance) +
                await _context.NetworkDevices.CountAsync(a => a.Status == AssetStatus.Maintenance) +
                await _context.MobileDevices.CountAsync(a => a.Status == AssetStatus.Maintenance) +
                await _context.Printers.CountAsync(a => a.Status == AssetStatus.Maintenance) +
                await _context.CustomAssets.CountAsync(a => a.Status == AssetStatus.Maintenance);

            return Ok(new
            {
                totalAssets,
                byType = new
                {
                    ipAddresses = ipAddressCount,
                    pcs = pcCount,
                    peripherals = peripheralCount,
                    networkDevices = networkDeviceCount,
                    mobileDevices = mobileDeviceCount,
                    printers = printerCount,
                    customAssets = customAssetCount
                },
                byStatus = new
                {
                    active = activeCount,
                    inactive = inactiveCount,
                    maintenance = maintenanceCount
                }
            });
        }

        // GET: api/Assets/search?q=searchterm
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchAssets([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest("Search query cannot be empty");
            }

            var searchTerm = q.ToLower();
            var results = new List<object>();

            // Search in IPAddresses
            var ipAddresses = await _context.IPAddresses
                .Where(i => i.Name.ToLower().Contains(searchTerm) ||
                           i.Location.ToLower().Contains(searchTerm) ||
                           (i.AssignedTo != null && i.AssignedTo.ToLower().Contains(searchTerm)) ||
                           i.IpAddress.Contains(searchTerm))
                .ToListAsync();
            results.AddRange(ipAddresses);

            // Search in PCs
            var pcs = await _context.PCs
                .Where(p => p.Name.ToLower().Contains(searchTerm) ||
                           p.Location.ToLower().Contains(searchTerm) ||
                           (p.AssignedTo != null && p.AssignedTo.ToLower().Contains(searchTerm)) ||
                           p.SerialNumber.ToLower().Contains(searchTerm) ||
                           p.Model.ToLower().Contains(searchTerm))
                .ToListAsync();
            results.AddRange(pcs);

            // Search in Peripherals
            var peripherals = await _context.Peripherals
                .Where(p => p.Name.ToLower().Contains(searchTerm) ||
                           p.Location.ToLower().Contains(searchTerm) ||
                           (p.AssignedTo != null && p.AssignedTo.ToLower().Contains(searchTerm)) ||
                           p.SerialNumber.ToLower().Contains(searchTerm))
                .ToListAsync();
            results.AddRange(peripherals);

            // Search in NetworkDevices
            var networkDevices = await _context.NetworkDevices
                .Where(n => n.Name.ToLower().Contains(searchTerm) ||
                           n.Location.ToLower().Contains(searchTerm) ||
                           (n.AssignedTo != null && n.AssignedTo.ToLower().Contains(searchTerm)) ||
                           n.SerialNumber.ToLower().Contains(searchTerm))
                .ToListAsync();
            results.AddRange(networkDevices);

            // Search in MobileDevices
            var mobileDevices = await _context.MobileDevices
                .Where(m => m.Name.ToLower().Contains(searchTerm) ||
                           m.Location.ToLower().Contains(searchTerm) ||
                           (m.AssignedTo != null && m.AssignedTo.ToLower().Contains(searchTerm)) ||
                           m.SerialNumber.ToLower().Contains(searchTerm))
                .ToListAsync();
            results.AddRange(mobileDevices);

            // Search in Printers
            var printers = await _context.Printers
                .Where(p => p.Name.ToLower().Contains(searchTerm) ||
                           p.Location.ToLower().Contains(searchTerm) ||
                           (p.AssignedTo != null && p.AssignedTo.ToLower().Contains(searchTerm)) ||
                           p.SerialNumber.ToLower().Contains(searchTerm))
                .ToListAsync();
            results.AddRange(printers);
            
            // Search in CustomAssets
            var customAssets = await _context.CustomAssets
                .Where(c => c.Name.ToLower().Contains(searchTerm) ||
                           c.Location.ToLower().Contains(searchTerm) ||
                           (c.AssignedTo != null && c.AssignedTo.ToLower().Contains(searchTerm)))
                .ToListAsync();
            // Optional: can filter into CustomProperties strings as well if we write an EF.Functions.Like or evaluate locally
            results.AddRange(customAssets);

            return Ok(results);
        }

        // GET: api/Assets/vlans
        [HttpGet("vlans")]
        public async Task<ActionResult<IEnumerable<string>>> GetVlans()
        {
            var vlans = await _context.IPAddresses
                .Where(i => !string.IsNullOrEmpty(i.Vlan))
                .Select(i => i.Vlan)
                .Distinct()
                .ToListAsync();

            return Ok(vlans);
        }
    }
}
