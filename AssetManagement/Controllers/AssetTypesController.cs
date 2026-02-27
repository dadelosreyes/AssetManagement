using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetTypesController : ControllerBase
    {
        private readonly AssetManagementContext _context;

        public AssetTypesController(AssetManagementContext context)
        {
            _context = context;
        }

        // GET: api/AssetTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssetType>>> GetAssetTypes()
        {
            return await _context.AssetTypes.Include(a => a.Fields).ToListAsync();
        }

        // GET: api/AssetTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssetType>> GetAssetType(string id)
        {
            var assetType = await _context.AssetTypes.Include(a => a.Fields).FirstOrDefaultAsync(a => a.Id == id);

            if (assetType == null)
            {
                return NotFound();
            }

            return assetType;
        }

        // POST: api/AssetTypes
        [HttpPost]
        public async Task<ActionResult<AssetType>> PostAssetType(AssetType assetType)
        {
            assetType.CreatedAt = DateTime.UtcNow;
            assetType.UpdatedAt = DateTime.UtcNow;
            
            if (assetType.Fields != null)
            {
                foreach (var field in assetType.Fields)
                {
                    field.AssetTypeId = assetType.Id;
                }
            }

            _context.AssetTypes.Add(assetType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssetType", new { id = assetType.Id }, assetType);
        }

        // PUT: api/AssetTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssetType(string id, AssetType assetType)
        {
            if (id != assetType.Id)
            {
                return BadRequest();
            }

            var existingRecord = await _context.AssetTypes.Include(a => a.Fields).FirstOrDefaultAsync(a => a.Id == id);
            
            if (existingRecord == null)
            {
                return NotFound();
            }

            existingRecord.Name = assetType.Name;
            existingRecord.Description = assetType.Description;
            existingRecord.RequiresIpAddress = assetType.RequiresIpAddress;
            existingRecord.UpdatedAt = DateTime.UtcNow;

            // Update fields
            _context.AssetTypeFields.RemoveRange(existingRecord.Fields);
            if (assetType.Fields != null)
            {
                foreach (var field in assetType.Fields)
                {
                    field.AssetTypeId = existingRecord.Id;
                    field.Id = Guid.NewGuid().ToString(); // Generate new IDs for re-added fields
                    _context.AssetTypeFields.Add(field);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssetTypeExists(id))
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

        // DELETE: api/AssetTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssetType(string id)
        {
            var assetType = await _context.AssetTypes.FindAsync(id);
            if (assetType == null)
            {
                return NotFound();
            }

            // Check if there are assets of this type
            var hasAssets = await _context.CustomAssets.AnyAsync(c => c.AssetTypeId == id);
            if (hasAssets)
            {
                return BadRequest("Cannot delete Asset Type because there are assets assigned to it.");
            }

            _context.AssetTypes.Remove(assetType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssetTypeExists(string id)
        {
            return _context.AssetTypes.Any(e => e.Id == id);
        }
    }
}
