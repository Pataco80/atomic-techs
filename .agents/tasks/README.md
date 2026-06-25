# Tasks

Implementation specs for the Atomic Tech's portfolio, executed with the `/apex`
workflow. Each spec is a self-contained unit of work; the APEX run artifacts
(analysis, plan, validation, tests) are saved under
`.claude/output/apex/<task-id>/`.

## Index

| #   | Spec                                         | Status  |
| --- | -------------------------------------------- | ------- |
| 01  | [Build Foundation](./01-build-foundation.md) | ✅ Done |

## Conventions

- Specs are named `NN-kebab-case.md` (zero-padded, ordered).
- Run a spec with `/apex -a -b -s -t .agents/tasks/NN-*.md`.
