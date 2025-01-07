# Changelog

All notable changes to the Task Manager CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-06

### Added
- Initial release of Task Manager CLI
- Basic CRUD operations for tasks:
  - Create new tasks with name, description, due date, priority, status, and category
  - Read/list all tasks or specific task by index
  - Update existing tasks with partial updates support
  - Delete tasks by index
- Task completion feature:
  - Mark tasks as done with completion timestamp
  - Filter tasks by completion status
- Error handling and validation:
  - Input validation for all commands
  - Proper error messages
  - Database operation safety checks
- Database implementation:
  - LowDB integration for JSON storage
  - Automatic database initialization
  - Data persistence between sessions

### Changed
- N/A (Initial release)

### Deprecated
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Fixed
- wrong assingment in
  - const updatedTask = await updateTask(Number(id), updatedInfo); // before
  - const updatedTask = await updateTask(options.index, updatedInfo); // after
  - db.data.task[taskIndex] = updatedTask; // before
  - db.data.tasks[taskIndex] = updatedTask; // after

### Security
- UUID implementation for secure task identification
- File system operation safety checks
- Input validation for all user inputs

## [Unreleased]

### Planned Features
- Import/export functionality for JSON and CSV files [work in progress]
- Bulk operations (update, delete, complete)
- Task categories management
- Due date reminders
- Task priority sorting
- Search functionality
- Interactive mode
- Configuration options
- Multiple task lists support
