import { program, Command } from "commander";
import { db, initDb } from "./db.js";
import { v4 as uuidv4 } from "uuid";

// Move all CLI logic inside the async function
const main = async () => {

    // Initialize DB first
    await initDb();
    console.log("Database Initialised");

    // Add new tasks to the CLI task-organizer
    const addTask = async (tasks) => {
        const newTask = {
            taskID: uuidv4(),
            ...tasks
        };

        // Ensure we have the latest data
        await db.read();

        // Add the new task
        db.data.tasks.push(newTask);

        // Write the changes
        await db.write();
    };

    // Get/List/Fetch all the tasks
    const getTasks = async (index) => {
        await db.read();

        if (index === undefined) {
            return db.data.tasks;
        }

        const taskIndex = parseInt(index);
        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= db.data.tasks.length) {
            throw new error(`Invalid index: ${taskIndex}`);
        }

        return db.data.tasks[taskIndex];
    }

    // Update tasks based on id
    const updateTask = async (index, updatedInfo) => {
        await db.read();

        const taskIndex = parseInt(index);

        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= db.data.tasks.length) {
            throw new error(`Invalid index: ${taskIndex}`);
        }

        const existingTask = db.data.tasks[taskIndex];

        const updatedTask = {
            ...existingTask,
            ...updatedInfo,
            id: existingTask.id
        };

        db.data.task[taskIndex] = updateTask;
        await db.write();
        return updatedTask;
    }

    // Delete the task based on index
    const deleteTask = async (index) => {
        await db.read();

        const taskIndex = parseInt(index);

        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= db.data.tasks.length) {
            throw new error(`Invalid index: ${index}`)
        }

        const deletedTask = db.data.tasks[taskIndex];
        db.data.tasks.splice(taskIndex, 1);
        await db.write();
        return deleteTask;
    }

    // Mark task as completed
    const markTaskDone = async (index) => {
        await db.read();

        const taskIndex = parseInt(index);

        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= db.data.tasks.length) {
            throw new error(`Invalid index ${taskIndex}`);
        }

        const existingTask = db.data.tasks[taskIndex];

        if (existingTask.status === "completed") {
            throw new error('Task is already marked as completed')
        }

        const updatedTask = {
            ...existingTask,
            status: 'completed',
            completed_at: new Date().toISOString()
        };

        db.data.tasks[taskIndex] = updateTask;
        return updatedTask;
    }

    program
        .name('task-organizer')
        .description('a CLI tool to help manage your tasks')
        .version('1.0.0');

    program
        .command('add')
        .description('Add a new task')
        .requiredOption('-n, --name <name>', 'Task name')
        .requiredOption('-d, --description <description>', 'Task description')
        .requiredOption('-t, --due_date <due_date>', 'Due date')
        .requiredOption('-p, --priority <priority>', 'Priority')
        .requiredOption('-s, --status <status>', 'Status')
        .requiredOption('-c, --category <category>', 'Category')
        .action(async (options) => {
            try {
                await addTask(options);
                console.log('Task added successfully');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        });
    program
        .command('done')
        .description('Mark a task as completed')
        .requiredOption('-i, --index <number>', 'index of task to mark as done')
        .action(async (options) => {
            try {
                const completedTask = await markTaskDone(options.index);
                console.log('Task marked as completed:');
                console.log(`  ID: ${completedTask.id}`);
                console.log(`  Name: ${completedTask.name}`);
                console.log(`  Description: ${completedTask.description}`);
                console.log(`  Due Date: ${completedTask.due_date}`);
                console.log(`  Priority: ${completedTask.priority}`);
                console.log(`  Status: ${completedTask.status}`);
                console.log(`  Category: ${completedTask.category}`);
                console.log(`  Completed At: ${completedTask.completed_at}`);
            } catch (error) {
                console.error('Error marking task as done:', error);
            }
        })

    program
        .command('list')
        .description('List available tasks')
        .option('-i, --index <index>', 'index of task')
        .option('--completed', 'show only completed tasks')
        .option('--pending', 'show only pending tasks')
        .option('--ongoing', 'show only ongoing tasks')
        .action(async (options) => {
            try {
                let tasks = await getTasks(options.index);

                if (Array.isArray(tasks)) {

                    // filter tasks as completed or pending
                    if (options.completed) {
                        tasks = tasks.filter(task => task.status === 'completed');
                    } else if (options.pending) {
                        tasks = tasks.filter(task => task.status === 'pending');
                    } else if (options.ongoing) {
                        tasks = tasks.filter(task => task.status === 'ongoing');
                    }

                    console.log("All tasks:");
                    tasks.forEach((task, index) => {
                        console.log(`\n[${index}] Task:`);
                        console.log(`  ID: ${task.id}`);
                        console.log(`  Name: ${task.name}`);
                        console.log(`  Description: ${task.description}`);
                        console.log(`  Due Date: ${task.due_date}`);
                        console.log(`  Priority: ${task.priority}`);
                        console.log(`  Status: ${task.status}`);
                        console.log(`  Category: ${task.category}`);
                        if (task.completed_at) {
                            console.log(`  Completed At: ${task.completed_at}`);
                        }
                    });
                } else {
                    console.log(`  ID: ${tasks.id}`);
                    console.log(`  Name: ${tasks.name}`);
                    console.log(`  Description: ${tasks.description}`);
                    console.log(`  Due Date: ${tasks.due_date}`);
                    console.log(`  Priority: ${tasks.priority}`);
                    console.log(`  Status: ${tasks.status}`);
                    console.log(`  Category: ${tasks.category}`);
                    if (task.completed_at) {
                        console.log(`  Completed At: ${task.completed_at}`);
                    }
                }
            } catch (error) {
                console.error('Error listing task:', error);
            }
        });

    program
        .command('update')
        .description('Update tasks information')
        .requiredOption('-i, --index <index>', 'index of task')
        .option('-n, --name <name>', 'Task name')
        .option('-d, --description <description>', 'Task description')
        .option('-t, --due_date <due_date>', 'Due date')
        .option('-p, --priority <priority>', 'Priority')
        .option('-s, --status <status>', 'Status')
        .option('-c, --category <category>', 'Category')
        .action(async (options) => {
            try {
                const { index, ...updatedInfo } = options;

                // Remove undefined values
                Object.keys(updatedInfo).forEach(key => updatedInfo[key] === undefined && delete updatedInfo[key]);

                // Only proceed if there are actual updates
                if (Object.keys(updates).length === 0) {
                    console.log('No updates provided');
                    return;
                }
                const updatedTask = await updateTask(Number(id), updatedInfo);
                console.log('Task updated successfully:');
                console.log(`  ID: ${updatedTask.id}`);
                console.log(`  Name: ${updatedTask.name}`);
                console.log(`  Description: ${updatedTask.description}`);
                console.log(`  Due Date: ${updatedTask.due_date}`);
                console.log(`  Priority: ${updatedTask.priority}`);
                console.log(`  Status: ${updatedTask.status}`);
                console.log(`  Category: ${updatedTask.category}`)

            } catch (error) {
                console.error('Error updating task:', error);
            }
        });

    program
        .command('delete')
        .description('Delete a task from task-organizer')
        .requiredOption('-i, --index <index>', 'index of task')
        .action(async (options) => {

            try {
                const deletedTask = await deleteTask(options.index);
                console.log('Task deleted successfully:');
                console.log(`  ID: ${deletedTask.id}`);
                console.log(`  Name: ${deletedTask.name}`);
                console.log(`  Description: ${deletedTask.description}`);
                console.log(`  Due Date: ${deletedTask.due_date}`);
                console.log(`  Priority: ${deletedTask.priority}`);
                console.log(`  Status: ${deletedTask.status}`);
                console.log(`  Category: ${deletedTask.category}`);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        })

    // Parse at the end of async function
    await program.parseAsync(process.argv);
};

// Run the main function
main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});