# Graph Report - Ornio  (2026-10-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 152 nodes · 259 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `15e2aa29`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api/index.ts
- compilerOptions
- Sidebar.tsx
- compilerOptions
- dependencies
- ZapisnikPage.tsx
- eslint.config.js
- package.json
- vite.config.ts
- devDependencies
- scripts
- PtakPage.tsx
- tsconfig.json
- eslint-plugin-react-refresh
- typescript-eslint

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `react-router-dom` - 10 edges
4. `lucide-react` - 8 edges
5. `@tanstack/react-query` - 8 edges
6. `zpozdeni()` - 6 edges
7. `Sidebar()` - 6 edges
8. `App()` - 5 edges
9. `scripts` - 5 edges
10. `Ptaka` - 4 edges

## Surprising Connections (you probably didn't know these)
- `ZapisnikList()` --indirect_call--> `getZapisniky()`  [INFERRED]
  frontend/src/components/ZapisnikList.tsx → frontend/src/api/index.ts
- `AppLayout()` --calls--> `Sidebar()`  [EXTRACTED]
  frontend/src/layout/AppLayout.tsx → frontend/src/layout/Sidebar.tsx
- `DruhPage()` --calls--> `getDruh()`  [EXTRACTED]
  frontend/src/pages/PtakPage.tsx → frontend/src/api/index.ts
- `DruhSearch()` --calls--> `getDruhy()`  [EXTRACTED]
  frontend/src/components/DruhSearch.tsx → frontend/src/api/index.ts
- `HnizdiciWidget()` --calls--> `getHnizdiciDruhy()`  [EXTRACTED]
  frontend/src/components/HnizdiciWidget.tsx → frontend/src/api/index.ts

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "api/index.ts"
Cohesion: 0.16
Nodes (20): DRUH, druhy, LOK, lokality, spatreni, TYP, typyPtaku, USER_ID (+12 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 2 - "Sidebar.tsx"
Cohesion: 0.24
Nodes (10): getDruhy(), getHnizdiciDruhy(), getZapisniky(), zpozdeni(), DruhSearch(), HnizdiciWidget(), ZapisnikList(), Sidebar() (+2 more)

### Community 3 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 4 - "dependencies"
Cohesion: 0.16
Nodes (12): dependencies, lucide-react@^1.61.0, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.4, tailwindcss@^4.3.3, @tanstack/react-query@^5.104.5, queryClient (+4 more)

### Community 5 - "ZapisnikPage.tsx"
Cohesion: 0.26
Nodes (7): getZapisnik(), App(), AppLayout(), Prazdno(), viditelnostText, ZapisnikPage(), Viditelnost

### Community 6 - "eslint.config.js"
Cohesion: 0.22
Nodes (8): eslint@^10.13.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, globals@^17.13.0, eslint, @eslint/js, eslint-plugin-react-hooks, globals

### Community 7 - "package.json"
Cohesion: 0.29
Nodes (6): @types/react@^19.3.0, name, private, type, version, @types/react

### Community 8 - "vite.config.ts"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.4, @vitejs/plugin-react@^6.1.2, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 9 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/node@^24.19.2, @types/react-dom@^19.3.0, typescript@~6.0.3, @types/node, @types/react-dom, typescript

### Community 10 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 11 - "PtakPage.tsx"
Cohesion: 0.60
Nodes (4): getDruh(), Blok(), DruhPage(), mesice

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-router-dom` connect `Sidebar.tsx` to `PtakPage.tsx`, `dependencies`, `ZapisnikPage.tsx`, `package.json`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `@tanstack/react-query` connect `dependencies` to `Sidebar.tsx`, `PtakPage.tsx`, `ZapisnikPage.tsx`, `package.json`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Sidebar.tsx` to `PtakPage.tsx`, `dependencies`, `ZapisnikPage.tsx`, `package.json`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._