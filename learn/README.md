# Teaching Workspace

This directory is a dedicated workspace for the [`teach`](../.claude/skills/teach/SKILL.md) skill,
kept separate from the application code so learning artifacts don't mix with the app.

## How to use it

Run Claude Code **from inside this directory** and invoke the skill:

```
/teach <what you want to learn>
```

The skill treats the current working directory as the teaching workspace, so launching it
here keeps everything it generates contained to `learn/`.

## What lives here

The skill creates these lazily as you learn — you don't need to make them by hand:

| Path | Purpose |
| --- | --- |
| `MISSION.md` | Why you're learning this topic; grounds every lesson. |
| `RESOURCES.md` | Curated, high-trust sources (knowledge) and communities (wisdom). |
| `NOTES.md` | Scratchpad for your teaching preferences and working notes. |
| `lessons/` | Self-contained HTML lessons, numbered `0001-<name>.html`. |
| `learning-records/` | ADR-style records of what you've learned, numbered `0001-<name>.md`. |
| `reference/` | Compressed reference docs — cheat sheets, glossaries, syntax. |
| `assets/` | Reusable components (shared stylesheet, quiz widgets, etc.). |

## One mission per workspace

The skill is designed around a single mission. If you want to learn two unrelated topics,
create a second workspace directory (e.g. `learn-<topic>/`) and run the skill from there.
