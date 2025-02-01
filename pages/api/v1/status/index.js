import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;

  const serverVersion = await database.query("SHOW server_version");
  const maxConnections = await database.query("SHOW max_connections");
  const openedConnections = await database.query({
    text: "SELECT COUNT(*)::int AS opened_connections FROM pg_stat_activity where datname = $1;",
    values: [databaseName],
  });

  const databaseVersion = serverVersion.rows[0].server_version;
  const databaseMaxConnections = maxConnections.rows[0].max_connections;
  const databaseOppenedConnections =
    openedConnections.rows[0].opened_connections;

  response.status(200).json({
    updated_at: updatedAt,
    version: databaseVersion,
    max_connections: parseInt(databaseMaxConnections),
    opened_connections: databaseOppenedConnections,
  });
}

export default status;
