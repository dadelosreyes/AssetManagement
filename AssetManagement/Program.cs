using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AssetManagement.Data;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Convert enums to strings in JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
        // Use camelCase for property names
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        // Accept both camelCase and PascalCase during deserialization
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .Select(e => new { e.Key, Errors = e.Value.Errors.Select(x => x.ErrorMessage) });
            Console.WriteLine("MODEL VALIDATION FAILED: " + System.Text.Json.JsonSerializer.Serialize(errors));
            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(context.ModelState);
        };
    });

builder.Services.AddDbContext<AssetManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AssetManagementContext") ?? throw new InvalidOperationException("Connection string 'AssetManagementContext' not found.")));

// CORS: allow any origin — in Docker, the browser only ever talks to the frontend
// container (same origin), and Nginx proxies /api to the API internally.
// AllowAnyOrigin() also keeps local development (npm run dev) working without config.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Asset Management API",
        Version = "v1",
        Description = "API for managing IT assets including IP addresses, PCs, peripherals, network devices, mobile devices, and printers"
    });
});

var app = builder.Build();

// Automatically apply migrations on startup (important for Docker containers)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AssetManagementContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Only redirect to HTTPS in development (production Docker uses HTTP only)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
