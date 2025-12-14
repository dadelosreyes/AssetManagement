using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeripheralsController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public PeripheralsController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/Peripherals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Peripheral>>> GetPeripherals()
        {
            return await _context.Peripherals.ToListAsync();
        }

        // GET: api/Peripherals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Peripheral>> GetPeripheral(string id)
        {
            var peripheral = await _context.Peripherals.FindAsync(id);

            if (peripheral == null)
            {
                return NotFound();
            }

            return peripheral;
        }

        // PUT: api/Peripherals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPeripheral(string id, Peripheral peripheral)
        {
            if (id != peripheral.Id)
            {
                return BadRequest();
            }

            peripheral.UpdatedAt = DateTime.UtcNow;
            _context.Entry(peripheral).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PeripheralExists(id))
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

        // POST: api/Peripherals
        [HttpPost]
        public async Task<ActionResult<Peripheral>> PostPeripheral(Peripheral peripheral)
        {
            _context.Peripherals.Add(peripheral);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPeripheral), new { id = peripheral.Id }, peripheral);
        }

        // DELETE: api/Peripherals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePeripheral(string id)
        {
            var peripheral = await _context.Peripherals.FindAsync(id);
            if (peripheral == null)
            {
                return NotFound();
            }

            _context.Peripherals.Remove(peripheral);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PeripheralExists(string id)
        {
            return _context.Peripherals.Any(e => e.Id == id);
        }
    }
}
