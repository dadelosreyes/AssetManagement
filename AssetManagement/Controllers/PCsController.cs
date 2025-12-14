using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PCsController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public PCsController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/PCs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PC>>> GetPCs()
        {
            return await _context.PCs.ToListAsync();
        }

        // GET: api/PCs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PC>> GetPC(string id)
        {
            var pc = await _context.PCs.FindAsync(id);

            if (pc == null)
            {
                return NotFound();
            }

            return pc;
        }

        // GET: api/PCs/serial/DL7090-001
        [HttpGet("serial/{serialNumber}")]
        public async Task<ActionResult<PC>> GetPCBySerial(string serialNumber)
        {
            var pc = await _context.PCs
                .FirstOrDefaultAsync(p => p.SerialNumber == serialNumber);

            if (pc == null)
            {
                return NotFound();
            }

            return pc;
        }

        // PUT: api/PCs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPC(string id, PC pc)
        {
            if (id != pc.Id)
            {
                return BadRequest();
            }

            pc.UpdatedAt = DateTime.UtcNow;
            _context.Entry(pc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PCExists(id))
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

        // POST: api/PCs
        [HttpPost]
        public async Task<ActionResult<PC>> PostPC(PC pc)
        {
            _context.PCs.Add(pc);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPC), new { id = pc.Id }, pc);
        }

        // DELETE: api/PCs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePC(string id)
        {
            var pc = await _context.PCs.FindAsync(id);
            if (pc == null)
            {
                return NotFound();
            }

            _context.PCs.Remove(pc);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PCExists(string id)
        {
            return _context.PCs.Any(e => e.Id == id);
        }
    }
}
