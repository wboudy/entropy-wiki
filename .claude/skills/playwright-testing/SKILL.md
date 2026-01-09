---
name: playwright-testing
description: Visual, functional, and layout testing using Playwright MCP. Use standalone for debugging or invoked by validation-before-close for frontend validation. Provides systematic testing patterns for browser automation.
---

# Playwright Testing Skill

Comprehensive testing and debugging patterns using Playwright MCP for browser automation, visual validation, and layout debugging.

## When to Use This Skill

### Standalone Invocation
Use directly when you need to:
- **Debug layout issues** - Inspect why content is narrow/misaligned
- **Capture screenshots** - Document features or current state
- **Explore UI behavior** - Understand how frontend works
- **Test user flows** - Verify multi-step interactions
- **Inspect DOM/styles** - Diagnose CSS or rendering issues

### Automatic Invocation (via validation-before-close)
This skill is automatically invoked by `validation-before-close` when:
- Work type involves frontend changes (components, layouts, styles)
- DoD requires visual validation
- Changes affect user-facing pages or UI

## Prerequisites

**MCP Server**: Playwright MCP must be configured (`.mcp.json` or `config.toml`)

**Dev Server**: Frontend application must be running locally
- For entropy-wiki: `localhost:3000` or `localhost:3004`

**Tools Available**: After restart, Playwright MCP provides tools like:
- `playwright_navigate` - Navigate to URL
- `playwright_screenshot` - Capture page screenshot
- `playwright_click` - Interact with elements
- `playwright_evaluate` - Run JavaScript in page context
- And more...

## Testing Patterns

### Pattern 1: Debug Layout Issue (Current Use Case)

**Scenario**: Content appears in narrow column instead of full width

**Steps**:
1. **Navigate to page**
   - Use `playwright_navigate` to load the problematic page
   - Example: `http://localhost:3000/beads`

2. **Take full-page screenshot**
   - Capture current state for analysis
   - Use `playwright_screenshot` with full page option

3. **Inspect element dimensions**
   - Identify the content container
   - Get computed dimensions (width, max-width, etc.)

4. **Check parent containers**
   - Trace up the DOM tree
   - Find which element is constraining width

5. **Examine CSS**
   - Check for `max-width`, `width`, `flex`, `grid` properties
   - Look for constraining classes (like `max-w-4xl` in Tailwind)

6. **Identify root cause**
   - Document the specific CSS property causing the issue
   - Note file and line number

**Example for entropy-wiki**:
```javascript
// Navigate to page
playwright_navigate("http://localhost:3000/beads")

// Screenshot current state
playwright_screenshot({ fullPage: true })

// Inspect main content element
playwright_evaluate(`
  const main = document.querySelector('main');
  return {
    width: main.offsetWidth,
    maxWidth: getComputedStyle(main).maxWidth,
    classes: main.className,
    parentGrid: getComputedStyle(main.parentElement).gridTemplateColumns
  }
`)

// Result: Found max-w-4xl limiting content to 896px
```

### Pattern 2: Visual Regression Validation

**Scenario**: Validate UI changes don't break layout

**Steps**:
1. Navigate to key pages
2. Take screenshots before changes (baseline)
3. Make changes
4. Take screenshots after changes
5. Compare visually or programmatically
6. Report PASS/FAIL

**Example**:
```javascript
// Baseline screenshot
playwright_navigate("http://localhost:3000/beads")
playwright_screenshot({ path: "/tmp/baseline-beads.png" })

// Make changes, rebuild
// ...

// New screenshot
playwright_screenshot({ path: "/tmp/current-beads.png" })

// Manual comparison or use image diff tool
```

### Pattern 3: Functional Testing

**Scenario**: Verify user interactions work correctly

**Steps**:
1. Navigate to page
2. Perform user actions (click, type, etc.)
3. Assert expected state changes
4. Take screenshots of key states
5. Report results

**Example for entropy-wiki**:
```javascript
// Test theme toggle
playwright_navigate("http://localhost:3000/beads")
playwright_screenshot({ path: "/tmp/light-theme.png" })

playwright_click("button[aria-label*='theme']")
playwright_screenshot({ path: "/tmp/dark-theme.png" })

// Verify theme changed
playwright_evaluate(`
  document.documentElement.classList.contains('dark')
`)
// Expected: true
```

### Pattern 4: Responsive Testing

**Scenario**: Verify layout works on different screen sizes

**Steps**:
1. Set viewport to mobile size
2. Navigate and screenshot
3. Set viewport to tablet size
4. Navigate and screenshot
5. Set viewport to desktop size
6. Navigate and screenshot
7. Compare layouts

**Example**:
```javascript
// Mobile (375x667)
playwright_setViewport({ width: 375, height: 667 })
playwright_navigate("http://localhost:3000/beads")
playwright_screenshot({ path: "/tmp/mobile.png" })

// Tablet (768x1024)
playwright_setViewport({ width: 768, height: 1024 })
playwright_screenshot({ path: "/tmp/tablet.png" })

// Desktop (1920x1080)
playwright_setViewport({ width: 1920, height: 1080 })
playwright_screenshot({ path: "/tmp/desktop.png" })
```

### Pattern 5: Component Isolation Testing

**Scenario**: Test specific component in isolation

**Steps**:
1. Navigate to page with component
2. Scroll component into view
3. Take screenshot of just that component
4. Interact with component
5. Validate component behavior

**Example**:
```javascript
// Test search dialog
playwright_navigate("http://localhost:3000/beads")

// Open search
playwright_click("button:has-text('Search')")

// Screenshot dialog
playwright_screenshot({
  clip: { x: 0, y: 0, width: 800, height: 600 }
})

// Type query
playwright_fill("input[placeholder*='Search']", "beads")

// Verify results appear
playwright_evaluate(`
  document.querySelectorAll('[role="button"]').length > 0
`)
```

## Integration with validation-before-close

The `validation-before-close` skill automatically invokes this skill for frontend work:

```markdown
Frontend change detected:
  ↓
validation-before-close:
  1. npm run build ✅
  2. Invoke playwright-testing skill
     → Navigate to affected pages
     → Take screenshots
     → Run functional tests
     → Report results
  3. Manual smoke testing (if needed)
  ↓
All validation passed? → Close bead
Validation failed? → Create bug bead, fix, re-validate
```

## Repository-Specific Patterns

### For entropy-wiki

**Dev Server Ports**:
- Primary: `http://localhost:3000`
- Alternate: `http://localhost:3004`

**Key Pages to Test**:
- `/beads` - Beads documentation section
- `/skills-bank` - Skills Bank section
- `/prompt-bank` - Prompt Bank section
- `/tooling-mcp` - MCP tooling section
- `/orchestration` - Orchestration section

**Common Checks**:
- **Content width**: Verify content uses full available width (not narrow column)
- **Sidebar navigation**: Check sidebar shows all sections
- **Section nav**: Top-level section tabs work
- **Theme toggle**: Dark/light mode switches properly
- **Search**: Search dialog opens and returns results
- **Mobile nav**: Hamburger menu works on small screens

**Standard Test Flow**:
```javascript
// 1. Navigate to page
playwright_navigate("http://localhost:3000/beads")

// 2. Wait for load
playwright_waitForSelector("main")

// 3. Screenshot
playwright_screenshot({ fullPage: true })

// 4. Test theme toggle
playwright_click("button[aria-label*='theme']")

// 5. Test search
playwright_click("button:has-text('Search')")
playwright_fill("input[placeholder*='Search']", "test query")

// 6. Verify no console errors
playwright_evaluate(`
  window.console.errors || []
`)
```

## Validation Checklist

Before marking frontend work as complete:

- [ ] All affected pages load without errors
- [ ] Screenshots show expected layout
- [ ] No console errors or warnings
- [ ] Theme toggle works (if applicable)
- [ ] Navigation works (sidebar, breadcrumbs)
- [ ] Search works (if applicable)
- [ ] Responsive on mobile/tablet/desktop
- [ ] No visual regressions from baseline

## Troubleshooting

### MCP Server Not Available
**Symptom**: Playwright tools not showing up

**Solution**:
1. Check `.mcp.json` exists with playwright config
2. Restart Claude Code to load MCP config
3. Run `/mcp` to verify playwright is connected

### Dev Server Not Running
**Symptom**: Navigate fails with connection refused

**Solution**:
1. Start dev server: `npm run dev`
2. Check port: `lsof -ti:3000`
3. Use correct port in navigate commands

### Screenshot Path Issues
**Symptom**: Screenshots not saving

**Solution**:
1. Use absolute paths: `/tmp/screenshot.png`
2. Or relative paths from project root
3. Check directory permissions

### Timeout Errors
**Symptom**: Navigation or actions timeout

**Solution**:
1. Increase timeout in Playwright commands
2. Wait for specific elements: `playwright_waitForSelector`
3. Check dev server is responsive

## Best Practices

1. **Always take screenshots** - Visual proof of state
2. **Test in viewport sizes** - Mobile, tablet, desktop
3. **Verify console clean** - No errors or warnings
4. **Test dark/light themes** - If theme toggle exists
5. **Document expected vs actual** - Clear failure descriptions
6. **Use descriptive file names** - `mobile-dark-theme-beads-page.png`
7. **Clean up screenshots** - Delete temporary files after validation

## Quick Reference

```markdown
Debug Layout Issue:
1. Navigate to page
2. Screenshot
3. Inspect element styles
4. Identify constraining CSS
5. Fix and re-validate

Validate Frontend Change:
1. Navigate to affected pages
2. Screenshot before/after
3. Test interactions
4. Check console for errors
5. Verify responsive behavior

Capture for Documentation:
1. Navigate to feature
2. Set viewport to standard size
3. Screenshot key states
4. Save with descriptive names
```

## Anti-Patterns

❌ **Don't skip screenshots** - Always capture visual evidence
❌ **Don't test only desktop** - Check mobile/tablet too
❌ **Don't ignore console errors** - They indicate real issues
❌ **Don't skip theme testing** - Both themes should work
❌ **Don't test without dev server** - Always verify it's running first

## Example: Complete Layout Debug Session

```javascript
// Current use case: Debug narrow content column

// 1. Start dev server (if not running)
// npm run dev

// 2. Navigate to problem page
playwright_navigate("http://localhost:3000/beads")

// 3. Take screenshot showing issue
playwright_screenshot({
  path: "/tmp/narrow-column-issue.png",
  fullPage: true
})

// 4. Inspect main content container
const mainStyles = playwright_evaluate(`
  const main = document.querySelector('main');
  return {
    className: main.className,
    computedWidth: getComputedStyle(main).width,
    computedMaxWidth: getComputedStyle(main).maxWidth,
    offsetWidth: main.offsetWidth,
    parentGrid: getComputedStyle(main.parentElement).gridTemplateColumns
  }
`)

// 5. Identify issue
// Found: className contains "max-w-4xl" (Tailwind class limiting to 896px)

// 6. Fix in code
// components/layout/DocLayout.tsx:23
// Change: max-w-4xl → w-full

// 7. Rebuild and re-test
// npm run build

// 8. Navigate again and screenshot
playwright_navigate("http://localhost:3000/beads")
playwright_screenshot({
  path: "/tmp/full-width-fixed.png",
  fullPage: true
})

// 9. Verify fix
playwright_evaluate(`
  const main = document.querySelector('main');
  return {
    hasMaxWidth: main.className.includes('max-w'),
    offsetWidth: main.offsetWidth
  }
`)
// Expected: { hasMaxWidth: false, offsetWidth: > 896 }

// 10. Validation passed ✅
```

---

**This skill provides the "how" for Playwright testing. The "when" is determined by validation-before-close.**
