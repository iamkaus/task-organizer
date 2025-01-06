# Task Organizer CLI

A command-line interface tool for managing tasks with features for creating, updating and completing tasks.

## Features

- ✨ Create new tasks with detailed information
- 📝 List all tasks or view specific task details
- 🔄 Update existing tasks
- ✅ Mark tasks as completed
- ❌ Delete tasks
- 🔍 Filter tasks by completion status

## Installation

1. Clone the repository:
```bash
git clone https://github.com/iamkaus/task-organizer.git
cd task-manager-cli
```

2. Install dependencies:
```bash
npm install
```

## Dependencies

- commander: CLI framework
- lowdb: JSON database
- uuid: Unique ID generation

## Usage

### Adding a Task

```bash
node task-organizer.js add \
  -n "Complete project" \
  -d "Finish the CLI project implementation" \
  -t "2024-01-20" \
  -p "high" \
  -s "pending" \
  -c "work"
```

### Listing Tasks

List all tasks:
```bash
node task-organizer.js list
```

List specific task:
```bash
node task-organizer.js list -i 0
```

Filter completed tasks:
```bash
node task-organizer.js list --completed
```
Filter ongoing tasks:
```bash
node task-organizer.js list --ongoing
```

Filter pending tasks:
```bash
node task-organizer.js list --pending
```

### Updating a Task

```bash
node task-organizer.js update \
  -i 0 \
  -n "Updated task name" \
  -s "in-progress"
```

### Marking Task as Done

```bash
node task-organizer.js done -i 0
```

### Deleting a Task

```bash
node task-organizer.js delete -i 0
```

## Task Structure

Each task contains the following properties:

- `taskID`: Unique task identifier (UUID)
- `name`: Task name
- `description`: Detailed description
- `due_date`: Due date
- `priority`: Task priority
- `status`: Current status
- `category`: Task category
- `completed_at`: Completion timestamp (if completed)

## Data Storage

Tasks are stored in a local `task.json` file using LowDB. The file is automatically created when you add your first task.

## Error Handling

The CLI includes error handling for:
- Invalid task indices
- Missing required fields
- Invalid export formats
- File system operations
- Database operations

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
