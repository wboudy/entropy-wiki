# Beads Viewer (bv) - Graph Analytics TUI

## Overview
Beads Viewer (`bv`) is a TUI (Terminal User Interface) visualization tool for the Beads issue tracker. It provides graph analytics capabilities to help agents identify critical path bottlenecks and prioritize work based on dependency analysis.

## Key Features

### Robot-Specific Flags
- **`--robot-insights`**: Generates machine-readable analytics about the dependency graph
- **`--robot-plan`**: Calculates optimal execution paths through the task graph

### Graph Analytics
- **PageRank Calculation**: Identifies the most critical tasks based on their position in the dependency graph
- **Critical Path Analysis**: Determines the longest path through dependencies to highlight bottleneck tasks
- **Dependency Visualization**: Shows relationships between tasks and their blockers

## Technical Value for Agents

The `--robot-insights` and `--robot-plan` flags expose graph analytics that agents can use to:
- Calculate PageRank for tasks (identify highest-impact work)
- Identify critical path bottlenecks in the dependency graph
- Make data-driven decisions about task prioritization
- Avoid working on tasks that will be blocked

## Usage Pattern

```bash
# View insights
bv --robot-insights

# Get execution plan
bv --robot-plan

# Interactive TUI
bv
```

## Integration with Beads

Works with the standard `.beads/` directory structure. Reads JSONL issue files to construct the dependency graph and provide analytics.

**Note**: This reference is based on repository description as the full documentation exceeded WebFetch limits. For complete details, see the repository directly.

**URL:** https://github.com/Dicklesworthstone/beads_viewer
