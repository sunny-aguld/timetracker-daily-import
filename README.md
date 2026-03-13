# TimeTracker Daily Import

VS Code extension to assist daily note input and send TimeTracker time entries from a TL section.

## Features

- Insert work item into Markdown: `@task=<name> #id=<id>` (QuickPick)
- Completion for `@task` in Markdown from `daily/work_items.json`
- Parse `## TL` section and send time entries to TimeTracker Web API
- Record submitted dates to `daily/timetracker_ledger.json`

## Usage

1. Open your `foam` workspace (workspace root should contain `daily/`).
2. Prepare files:
   - `daily/work_items.json`
   - `daily/user.json` (loginName/password)
3. Open a daily note `.md` that contains `## TL`.
4. Run commands from Command Palette:
   - `TimeTracker: Insert Work Item`
   - `TimeTracker: Push Time Entries From TL`

## Settings

- `timetrackerDailyImport.apiBaseUrl`
  - Example: `http://130.0.0.249/TimeTrackerNX/api`
- `timetrackerDailyImport.workItemsPath`
  - Default: `daily/work_items.json`

## Notes

- This extension assumes TL format uses `HH:MM` time (e.g. `09:00`).
- Every TL line except the last closing line must include `#id=<id>`.
- If TL format is invalid, the process stops with an error.

## Build VSIX

To create a distributable VSIX for another PC:

```powershell
npm.cmd install
npm.cmd run package:vsix
```

The output file is created in the repository root, for example `timetracker-daily-import-1.0.1.vsix`.

To install it on another PC:

1. Copy the `.vsix` file.
2. In VS Code, open `Extensions: Install from VSIX...`.
3. Select the copied `.vsix`.
4. Reload VS Code if prompted.

## License

MIT
