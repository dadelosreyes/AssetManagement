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
    });

builder.Services.AddDbContext<AssetManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AssetManagementContext") ?? throw new InvalidOperationException("Connection string 'AssetManagementContext' not found.")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:8080") // Vite default ports
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
