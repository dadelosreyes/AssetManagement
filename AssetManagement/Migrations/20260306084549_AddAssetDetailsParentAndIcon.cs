using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddAssetDetailsParentAndIcon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "AssetTypes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "Asset",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentAssetId",
                table: "Asset",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asset_ParentAssetId",
                table: "Asset",
                column: "ParentAssetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Asset_Asset_ParentAssetId",
                table: "Asset",
                column: "ParentAssetId",
                principalTable: "Asset",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asset_Asset_ParentAssetId",
                table: "Asset");

            migrationBuilder.DropIndex(
                name: "IX_Asset_ParentAssetId",
                table: "Asset");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "AssetTypes");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "Asset");

            migrationBuilder.DropColumn(
                name: "ParentAssetId",
                table: "Asset");
        }
    }
}
