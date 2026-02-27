using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomAssetIpAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssetTypeFields_AssetTypes_AssetTypeId",
                table: "AssetTypeFields");

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "CustomAssets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresIpAddress",
                table: "AssetTypes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "AssetTypeId",
                table: "AssetTypeFields",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_AssetTypeFields_AssetTypes_AssetTypeId",
                table: "AssetTypeFields",
                column: "AssetTypeId",
                principalTable: "AssetTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssetTypeFields_AssetTypes_AssetTypeId",
                table: "AssetTypeFields");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "CustomAssets");

            migrationBuilder.DropColumn(
                name: "RequiresIpAddress",
                table: "AssetTypes");

            migrationBuilder.AlterColumn<string>(
                name: "AssetTypeId",
                table: "AssetTypeFields",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AssetTypeFields_AssetTypes_AssetTypeId",
                table: "AssetTypeFields",
                column: "AssetTypeId",
                principalTable: "AssetTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
