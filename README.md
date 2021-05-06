# JSQL
Use **JSON** as **SQL**.

# Installing

```sh
$ npm i --save @devsnowflake/jsql
```

> Note: This library is very new and does not support most of the statements

# Example

```js
const { Database } = require("@devsnowflake/jsql");

// file based
const db = new Database("./database.json");

// in-memory
const db = new Database(":memory:");

// creating a table
db.prepare(`CREATE TABLE IF NOT EXISTS "DEMO" ("key" TEXT, "value" TEXT)`).run();

// inserting data
db.prepare(`INSERT INTO "DEMO" ("key","value") VALUES ("test_key", "test_value")`).run();

// fetching data
db.prepare(`SELECT * FROM "DEMO"`).run();

// fetching data in limit
db.prepare(`SELECT * FROM "DEMO" LIMIT 3`).run(); // returns 3 items if available

// drop a table
db.prepare(`DROP TABLE "DEMO"`).run();
```