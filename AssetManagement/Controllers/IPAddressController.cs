using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IPAddressesController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public IPAddressesController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/IPAddresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IPAddress>>> GetIPAddresses()
        {
            return await _context.IPAddresses.ToListAsync();
        }

        // GET: api/IPAddresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IPAddress>> GetIPAddress(string id)
        {
            var ipAddress = await _context.IPAddresses.FindAsync(id);

            if (ipAddress == null)
            {
                return NotFound();
            }

            return ipAddress;
        }

        // GET: api/IPAddresses/vlan/VLAN-100
        [HttpGet("vlan/{vlan}")]
        public async Task<ActionResult<IEnumerable<IPAddress>>> GetIPAddressesByVlan(string vlan)
        {
            return await _context.IPAddresses
                .Where(i => i.Vlan == vlan)
                .ToListAsync();
        }

        // PUT: api/IPAddresses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIPAddress(string id, IPAddress ipAddress)
        {
            if (id != ipAddress.Id)
            {
                return BadRequest();
            }

            ipAddress.UpdatedAt = DateTime.UtcNow;
            _context.Entry(ipAddress).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IPAddressExists(id))
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

        // POST: api/IPAddresses
        [HttpPost]
        public async Task<ActionResult<IPAddress>> PostIPAddress(IPAddress ipAddress)
        {
            _context.IPAddresses.Add(ipAddress);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIPAddress), new { id = ipAddress.Id }, ipAddress);
        }

        // DELETE: api/IPAddresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIPAddress(string id)
        {
            var ipAddress = await _context.IPAddresses.FindAsync(id);
            if (ipAddress == null)
            {
                return NotFound();
            }

            _context.IPAddresses.Remove(ipAddress);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IPAddressExists(string id)
        {
            return _context.IPAddresses.Any(e => e.Id == id);
        }
    }
}
