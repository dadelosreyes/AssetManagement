using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MobileDevicesController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public MobileDevicesController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/MobileDevices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MobileDevice>>> GetMobileDevices()
        {
            return await _context.MobileDevices.ToListAsync();
        }

        // GET: api/MobileDevices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MobileDevice>> GetMobileDevice(string id)
        {
            var mobileDevice = await _context.MobileDevices.FindAsync(id);

            if (mobileDevice == null)
            {
                return NotFound();
            }

            return mobileDevice;
        }

        // PUT: api/MobileDevices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMobileDevice(string id, MobileDevice mobileDevice)
        {
            if (id != mobileDevice.Id)
            {
                return BadRequest();
            }

            mobileDevice.UpdatedAt = DateTime.UtcNow;
            _context.Entry(mobileDevice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MobileDeviceExists(id))
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

        // POST: api/MobileDevices
        [HttpPost]
        public async Task<ActionResult<MobileDevice>> PostMobileDevice(MobileDevice mobileDevice)
        {
            _context.MobileDevices.Add(mobileDevice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMobileDevice), new { id = mobileDevice.Id }, mobileDevice);
        }

        // DELETE: api/MobileDevices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMobileDevice(string id)
        {
            var mobileDevice = await _context.MobileDevices.FindAsync(id);
            if (mobileDevice == null)
            {
                return NotFound();
            }

            _context.MobileDevices.Remove(mobileDevice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MobileDeviceExists(string id)
        {
            return _context.MobileDevices.Any(e => e.Id == id);
        }
    }
}
