using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrintersController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public PrintersController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/Printers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Printer>>> GetPrinters()
        {
            return await _context.Printers.ToListAsync();
        }

        // GET: api/Printers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Printer>> GetPrinter(string id)
        {
            var printer = await _context.Printers.FindAsync(id);

            if (printer == null)
            {
                return NotFound();
            }

            return printer;
        }

        // PUT: api/Printers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrinter(string id, Printer printer)
        {
            if (id != printer.Id)
            {
                return BadRequest();
            }

            printer.UpdatedAt = DateTime.UtcNow;
            _context.Entry(printer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrinterExists(id))
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

        // POST: api/Printers
        [HttpPost]
        public async Task<ActionResult<Printer>> PostPrinter(Printer printer)
        {
            _context.Printers.Add(printer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrinter), new { id = printer.Id }, printer);
        }

        // DELETE: api/Printers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrinter(string id)
        {
            var printer = await _context.Printers.FindAsync(id);
            if (printer == null)
            {
                return NotFound();
            }

            _context.Printers.Remove(printer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PrinterExists(string id)
        {
            return _context.Printers.Any(e => e.Id == id);
        }
    }
}
