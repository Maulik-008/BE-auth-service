const { Client } = require("pg");
require("dotenv").config();

async function checkMigrations() {
    const client = new Client({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        console.log("Connected to database");

        // Check if migrations table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'migrations'
            );
        `);

        if (tableCheck.rows[0].exists) {
            console.log("\nMigrations table exists");

            // Get all migration records
            const migrations = await client.query(
                "SELECT * FROM migrations ORDER BY id",
            );

            if (migrations.rows.length > 0) {
                console.log("\nExisting migration records:");
                migrations.rows.forEach((row) => {
                    console.log(
                        `- ID: ${row.id}, Name: ${row.name}, Timestamp: ${row.timestamp}`,
                    );
                });
            } else {
                console.log("Migrations table is empty");
            }
        } else {
            console.log("Migrations table does not exist");
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await client.end();
    }
}

checkMigrations();
