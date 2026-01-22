# CLAUDE.MD

This file contains guidelines and context for working with Claude Code on this repository.

## Project Overview

This is a testing repository for experimenting with Claude Code and AI-assisted development workflows.

## Development Guidelines

### Code Style
- Follow consistent formatting and naming conventions
- Write clear, self-documenting code
- Add comments only where logic isn't self-evident

### Git Workflow
- Work on feature branches prefixed with `claude/`
- Write clear, descriptive commit messages
- Push changes to the appropriate branch before creating PRs

### Testing
- Run existing tests before committing changes
- Add tests for new functionality when applicable
- Ensure the build passes before pushing

## Claude Code Best Practices

### When Working on Tasks
1. **Read before modifying** - Always read existing files before making changes
2. **Plan complex tasks** - Use the todo list for multi-step tasks
3. **Test changes** - Verify that changes work as expected
4. **Commit incrementally** - Make logical, atomic commits

### Communication Preferences
- Be concise and direct
- Focus on technical accuracy
- Provide file paths and line numbers when referencing code

### Tool Usage
- Prefer specialized tools (Read, Edit, Write) over bash commands for file operations
- Use parallel tool calls when operations are independent
- Use the Task tool for complex, multi-step operations

## Project Structure

```
.
├── .git/           # Git repository data
└── CLAUDE.MD       # This file
```

## Notes

This repository serves as a testing ground for Claude Code functionality and workflows.

---

*Last updated: 2026-01-22*
