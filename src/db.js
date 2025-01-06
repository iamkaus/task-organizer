import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// Define the adapter
const file = new JSONFile('task.json');

// Define default data structure
const defaultData = {
    tasks: []
};

// Initialize database with default data
const db = new Low(file, defaultData);

const initDb = async () => {
    // Read existing data from file
    await db.read();

    // Initialize with default data if db.data is null
    if (db.data === null) {
        db.data = defaultData;
    }

    // Ensure tasks array exists
    if (!db.data.tasks) {
        db.data.tasks = [];
    }

    // Write initial data to file
    await db.write();
};

export { db, initDb };