# JSON SQL Query
Use **CRUD** operations on **JSON** with **SQL** queries.

# Installing

```sh
$ npm i --save json-sql-query
```

> Note: This library is very new and does not support most of the statements

# Example

```js
const { Database } = require("json-sql-query");

// file based
const db = new Database("./database.json");

// in-memory
const db = new Database(":memory:");

// creating a table
db.prepare(`CREATE TABLE IF NOT EXISTS "DEMO" ("key" TEXT, "value" TEXT)`).run();

// inserting data
db.prepare(`INSERT INTO "DEMO" ("key","value") VALUES ("test_key", "test_value")`).run();

// fetching data
db.prepare(`SELECT * FROM "DEMO"`).run().parse();

// fetching data in limit
db.prepare(`SELECT * FROM "DEMO" LIMIT 3`).run().parse(); // returns 3 items if available

// update existing data
db.prepare(`UPDATE "DEMO" SET "value" = "test data" WHERE "key" = "test_key"`).run()

// delete specific item
db.prepare(`DELETE FROM "DEMO" WHERE "key" = "test_key"`).run();

// drop a table
db.prepare(`DROP TABLE "DEMO"`).run();
```