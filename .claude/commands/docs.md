---
name: docs
description: Standardize JSDoc documentation
---

Standardize TypeScript JSDoc documentation according to established patterns and best practices.

**Arguments**: $ARGUMENTS

**Usage:**
- `/docs @filename` - Standardize documentation for a specific file
- `/docs` - Interactive mode with scope selection

Steps:
1. Parse arguments: If `$ARGUMENTS` contains a file path (starts with @), focus on that specific file's public methods
2. If no arguments provided, ask user to choose scope:
   - "Scan all model files in src/model/"
   - "Scan only git modified files"
   - "Scan specific file" (then prompt for file path)
3. Analyze each public method's JSDoc and apply fixes only when needed:
   - Skip methods that already have proper documentation
   - Only fix specific issues (malformed tags, typos, missing hyphens)
   - Preserve existing well-formatted descriptions
4. Run `bun run build` to validate changes
5. Report summary of fixes applied

**Important**: Do NOT change any other code or rewrite existing good documentation.

## Common Fixes Applied

**JSDoc Tags:**
- Replace `@return` with `@returns` (always use plural form)
- Add missing hyphens in `@param` tags: `@param name - Description`
- Fix malformed tags like `@returnss` → `@returns`

**Grammar & Spelling:**
- Fix "chainning" → "chaining" typo throughout codebase
- Standardize method chaining documentation: `@returns This ClassName, for chaining.`
- Use consistent verb tenses: "Gets the..." for getters, "Sets the..." for setters

**Class Documentation:**
- Enhance class descriptions with domain context and business purpose
- Use `[[ClassName]]` notation for cross-references to other classes
- Include relationships between entities (e.g., Users own Books, manage Collections)

## Required JSDoc Format Structure

**MANDATORY FORMAT - Every JSDoc block must follow this exact structure:**

```typescript
/**
 * [DESCRIPTION] - Always start with a clear description of what the method/class does.
 *
 * @param paramName - Parameter description (if any parameters exist)
 * @param anotherParam - Another parameter description
 *
 * @returns Return value description (if method returns something)
 */
```

**Format Examples:**
```typescript
/**
 * Gets the name of the Account.
 *
 * @returns The name of the Account
 */
getName(): string

/**
 * Sets the name of the Account.
 *
 * @param name - The name to set
 *
 * @returns This Account, for chaining
 */
setName(name: string): Account

/**
 * Creates a new transaction with the specified details.
 *
 * @param amount - The transaction amount
 * @param description - The transaction description
 * @param date - The transaction date (optional)
 *
 * @returns The created Transaction object
 */
createTransaction(amount: number, description: string, date?: Date): Transaction

/**
 * This class defines a User on the Bkper platform.
 *
 * Users can own and collaborate on [[Books]], manage [[Collections]], and connect to external services through [[Connections]].
 *
 * @public
 */
export class User
```

**Critical Requirements:**
- ❌ **NEVER** have only `@returns` without a description
- ❌ **NEVER** have only `@param` without a description  
- ✅ **ALWAYS** start with a method/class description
- ✅ **ALWAYS** use blank lines to separate sections
- ✅ **ALWAYS** use hyphens in `@param name - description` format

**Scope Options (when no @filename provided):**
1. **All model files** - Process all `.ts` files in `src/model/` directory
2. **Modified files only** - Process only files with git modifications (staged + unstaged)
3. **Specific file** - Prompt for exact file path to process

**Public Methods Focus:**
- Only standardize documentation for `public` methods and properties
- Skip `private`, `protected`, and `@internal` marked methods
- Include class-level documentation and constructor documentation
- Focus on exported classes, interfaces, and enums

**Documentation Quality Check:**
Before modifying any JSDoc block, verify it needs improvement by checking for:
- ✅ **Skip if already good**: Proper `@returns`, correct `@param name - description`, no typos
- ⚠️ **Fix only specific issues**: `@return` → `@returns`, missing hyphens, "chainning" → "chaining"
- ❌ **Needs enhancement**: Missing JSDoc, incomplete descriptions, malformed tags

**Conservative Approach:**
- Only make minimal necessary changes to fix specific issues
- Preserve existing descriptions that are already well-written
- Don't rewrite or enhance documentation that's already adequate

**Build Verification:**
Run `bun run build` to ensure TypeScript compilation, tests, and API documentation generation complete successfully.