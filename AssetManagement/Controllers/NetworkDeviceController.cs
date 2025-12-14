using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NetworkDevicesController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public NetworkDevicesController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/NetworkDevices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NetworkDevice>>> GetNetworkDevices()
        {
            return await _context.NetworkDevices.ToListAsync();
        }

        // GET: api/NetworkDevices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NetworkDevice>> GetNetworkDevice(string id)
        {
            var networkDevice = await _context.NetworkDevices.FindAsync(id);

            if (networkDevice == null)
            {
                return NotFound();
            }

            return networkDevice;
        }

        // PUT: api/NetworkDevices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNetworkDevice(string id, NetworkDevice networkDevice)
        {
            if (id != networkDevice.Id)
            {
                return BadRequest();
            }

            networkDevice.UpdatedAt = DateTime.UtcNow;
            _context.Entry(networkDevice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NetworkDeviceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/NetworkDevices
        [HttpPost]
        public async Task<ActionResult<NetworkDevice>> PostNetworkDevice(NetworkDevice networkDevice)
        {
            _context.NetworkDevices.Add(networkDevice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNetworkDevice), new { id = networkDevice.Id }, networkDevice);
        }

        // DELETE: api/NetworkDevices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNetworkDevice(string id)
        {
            var networkDevice = await _context.NetworkDevices.FindAsync(id);
            if (networkDevice == null)
            {
                return NotFound();
            }

            _context.NetworkDevices.Remove(networkDevice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NetworkDeviceExists(string id)
        {
            return _context.NetworkDevices.Any(e => e.Id == id);
        }
    }

}
