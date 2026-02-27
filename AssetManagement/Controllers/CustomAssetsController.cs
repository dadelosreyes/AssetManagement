using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomAssetsController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public CustomAssetsController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/CustomAssets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomAsset>>> GetCustomAssets()
        {
            return await _context.CustomAssets.ToListAsync();
        }

        // GET: api/CustomAssets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomAsset>> GetCustomAsset(string id)
        {
            var customAsset = await _context.CustomAssets.FindAsync(id);

            if (customAsset == null)
            {
                return NotFound();
            }

            return customAsset;
        }

        // POST: api/CustomAssets
        [HttpPost]
        public async Task<ActionResult<CustomAsset>> PostCustomAsset(CustomAsset customAsset)
        {
            customAsset.CreatedAt = DateTime.UtcNow;
            customAsset.UpdatedAt = DateTime.UtcNow;

            _context.CustomAssets.Add(customAsset);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomAsset", new { id = customAsset.Id }, customAsset);
        }

        // PUT: api/CustomAssets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomAsset(string id, CustomAsset customAsset)
        {
            if (id != customAsset.Id)
            {
                return BadRequest();
            }

            customAsset.UpdatedAt = DateTime.UtcNow;
            _context.Entry(customAsset).State = EntityState.Modified;
            
            // Do not overwrite CreatedAt
            _context.Entry(customAsset).Property(x => x.CreatedAt).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomAssetExists(id))
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

        // DELETE: api/CustomAssets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomAsset(string id)
        {
            var customAsset = await _context.CustomAssets.FindAsync(id);
            if (customAsset == null)
            {
                return NotFound();
            }

            _context.CustomAssets.Remove(customAsset);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomAssetExists(string id)
        {
            return _context.CustomAssets.Any(e => e.Id == id);
        }
    }
}
