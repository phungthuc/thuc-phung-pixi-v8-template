# PixiJS v8 Template Starter

## 📁 Project Structure
```
my-pixijs-game/
├── .cursorrules                    # Cursor IDE rules (copy from above)
├── package.json
├── tsconfig.json
├── vite.config.js
├── index.html
└── src/
    ├── main.ts
    ├── core/
    │   ├── Game.ts
    │   ├── BoardManager.ts
    │   ├── Node.ts
    │   ├── PathTracker.ts
    │   ├── RefillManager.ts
    │   └── UIManager.ts
    ├── systems/
    └── utils/
```

## 📦 package.json
```json
{
  "name": "my-pixijs-game",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pixi.js": "^8.6.6"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## ⚙️ tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🚀 vite.config.js
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

## 🌐 index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PixiJS v8 Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

## 🎮 src/main.ts
```typescript
import { Game } from "./core/Game";

window.onload = async () => {
    const game = new Game();
    await game.init();
    game.start();
};
```

## 🎯 src/core/Game.ts
```typescript
import { Application, Container } from 'pixi.js';
import { BoardManager } from './BoardManager';
import { PathTracker } from './PathTracker';
import { UIManager } from './UIManager';
import { RefillManager } from './RefillManager';
import { Node } from './Node';

export class Game {
    app: Application;
    boardManager!: BoardManager;
    pathTracker!: PathTracker;
    uiManager!: UIManager;
    refillManager!: RefillManager;
    stage: Container;
    score: number = 0;

    constructor() {
        this.app = new Application();
        this.stage = this.app.stage;
    }

    async init() {
        // Initialize PixiJS Application
        await this.app.init({
            width: 480,
            height: 720,
            backgroundColor: 0x222a36,
            antialias: true,
        });
        
        document.body.appendChild(this.app.canvas);
        const viewStyle = this.app.canvas.style;
        viewStyle.position = "absolute";
        viewStyle.display = "block";

        // Initialize managers
        this.boardManager = new BoardManager();
        const board = this.boardManager.getBoardContainer();
        board.x = (this.app.screen.width - board.width) / 2;
        board.y = (this.app.screen.height - board.height) / 2;
        this.stage.addChild(board);

        this.uiManager = new UIManager();
        this.stage.addChild(this.uiManager.container);

        this.pathTracker = new PathTracker(this.boardManager);
        this.pathTracker.onMatch = (nodes) => {
            this.handleMatch(nodes);
        };

        this.refillManager = new RefillManager(this.boardManager, this.pathTracker);
    }

    start() {
        // Game loop or additional initialization
    }

    addScore(points: number) {
        this.score += points;
        this.uiManager.updateScore(this.score);
    }

    handleMatch(nodes: Node[]) {
        this.boardManager.removeNodes(nodes);
        this.addScore(nodes.length * 10);
        this.refillManager.refill();
    }
}
```

## 🎲 src/core/Node.ts
```typescript
import { Graphics } from 'pixi.js';

export type NodeColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

const COLOR_MAP: Record<NodeColor, number> = {
    red: 0xff4b4b,
    blue: 0x4b7bff,
    green: 0x4bff7b,
    yellow: 0xffe14b,
    purple: 0xb14bff,
};

export class Node extends Graphics {
    row: number;
    col: number;
    color: NodeColor;
    isSelected: boolean = false;
    static readonly RADIUS = 32;

    constructor(row: number, col: number, color: NodeColor) {
        super();
        this.row = row;
        this.col = col;
        this.color = color;
        this.drawNode();
        this.eventMode = "static";
        this.cursor = "pointer";
    }

    drawNode() {
        this.clear();
        this.lineStyle(this.isSelected ? 6 : 3, 0xffffff, 1);
        this.beginFill(COLOR_MAP[this.color]);
        this.drawCircle(0, 0, Node.RADIUS);
        this.endFill();
    }

    select() {
        this.isSelected = true;
        this.drawNode();
    }

    deselect() {
        this.isSelected = false;
        this.drawNode();
    }
}
```

## 🎯 src/core/BoardManager.ts
```typescript
import { Node, NodeColor } from './Node';
import { Container } from 'pixi.js';

const COLORS: NodeColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export class BoardManager {
    grid: (Node | null)[][];
    rows: number = 6;
    cols: number = 6;
    container: Container;
    static readonly PADDING = 12;

    constructor() {
        this.container = new Container();
        this.grid = [];
        
        for (let row = 0; row < this.rows; row++) {
            const rowArr: (Node | null)[] = [];
            for (let col = 0; col < this.cols; col++) {
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                const node = new Node(row, col, color);
                node.x = col * (Node.RADIUS * 2 + BoardManager.PADDING) + Node.RADIUS + BoardManager.PADDING;
                node.y = row * (Node.RADIUS * 2 + BoardManager.PADDING) + Node.RADIUS + BoardManager.PADDING;
                this.container.addChild(node);
                rowArr.push(node);
            }
            this.grid.push(rowArr);
        }
    }

    getNode(row: number, col: number): Node | null {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
        return this.grid[row][col];
    }

    getBoardContainer(): Container {
        return this.container;
    }

    removeNodes(nodes: Node[]): void {
        for (const node of nodes) {
            this.container.removeChild(node);
            this.grid[node.row][node.col] = null;
        }
    }

    refill(): void {
        // Implement refill logic
    }
}
```

## 🎮 src/core/PathTracker.ts
```typescript
import { BoardManager } from './BoardManager';
import { Node } from './Node';

export class PathTracker {
    boardManager: BoardManager;
    currentPath: Node[] = [];
    isTracking: boolean = false;
    onMatch: (nodes: Node[]) => void = () => {};

    constructor(boardManager: BoardManager) {
        this.boardManager = boardManager;
        this.registerPointerEvents();
    }

    registerPointerEvents() {
        for (let row = 0; row < this.boardManager.rows; row++) {
            for (let col = 0; col < this.boardManager.cols; col++) {
                const node = this.boardManager.getNode(row, col);
                if (!node) continue;
                this.registerNodeEvents(node);
            }
        }
        
        document.addEventListener('pointerup', () => this.onPointerUp());
    }

    registerNodeEvents(node: Node) {
        node.on('pointerdown', () => this.onPointerDown(node));
        node.on('pointerover', () => this.onPointerMove(node));
    }

    onPointerDown(node: Node): void {
        this.isTracking = true;
        this.clearPath();
        this.addToPath(node);
    }

    onPointerMove(node: Node): void {
        if (!this.isTracking) return;
        if (this.currentPath.length === 0) return;
        const last = this.currentPath[this.currentPath.length - 1];
        if (node === last) return;
        if (this.currentPath.includes(node)) return;
        if (node.color !== last.color) return;
        if (!this.isAdjacent(node, last)) return;
        this.addToPath(node);
    }

    onPointerUp(): void {
        if (!this.isTracking) return;
        this.isTracking = false;
        if (this.currentPath.length >= 3) {
            this.onMatch([...this.currentPath]);
        }
        this.clearPath();
    }

    addToPath(node: Node) {
        this.currentPath.push(node);
        node.select();
    }

    clearPath() {
        for (const node of this.currentPath) node.deselect();
        this.currentPath = [];
    }

    isAdjacent(a: Node, b: Node): boolean {
        const dr = Math.abs(a.row - b.row);
        const dc = Math.abs(a.col - b.col);
        return dr <= 1 && dc <= 1 && (dr + dc > 0);
    }
}
```

## 🔄 src/core/RefillManager.ts
```typescript
import { BoardManager } from './BoardManager';
import { PathTracker } from './PathTracker';
import { Node, NodeColor } from './Node';

const COLORS: NodeColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export class RefillManager {
    boardManager: BoardManager;
    pathTracker: PathTracker;

    constructor(boardManager: BoardManager, pathTracker: PathTracker) {
        this.boardManager = boardManager;
        this.pathTracker = pathTracker;
    }

    refill(): void {
        // Implement refill logic with event registration
        for (let col = 0; col < this.boardManager.cols; col++) {
            let emptyRows: number[] = [];
            for (let row = this.boardManager.rows - 1; row >= 0; row--) {
                const node = this.boardManager.getNode(row, col);
                if (!node) {
                    emptyRows.push(row);
                } else if (emptyRows.length > 0) {
                    const newRow = emptyRows.shift()!;
                    this.boardManager.grid[newRow][col] = node;
                    this.boardManager.grid[row][col] = null as any;
                    node.row = newRow;
                    emptyRows.push(row);
                }
            }
            
            for (const row of emptyRows) {
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                const newNode = new Node(row, col, color);
                newNode.x = col * (Node.RADIUS * 2 + BoardManager.PADDING) + Node.RADIUS + BoardManager.PADDING;
                newNode.y = row * (Node.RADIUS * 2 + BoardManager.PADDING) + Node.RADIUS + BoardManager.PADDING;
                this.boardManager.grid[row][col] = newNode;
                this.boardManager.container.addChild(newNode);
                this.pathTracker.registerNodeEvents(newNode);
            }
        }
    }
}
```

## 🎨 src/core/UIManager.ts
```typescript
import { Container, Text } from 'pixi.js';

export class UIManager {
    container: Container;
    scoreText: Text;

    constructor() {
        this.container = new Container();
        this.scoreText = new Text('Score: 0', { fontSize: 32, fill: 0xffffff });
        this.scoreText.anchor.set(0.5, 0);
        this.scoreText.x = 240;
        this.scoreText.y = 24;
        this.container.addChild(this.scoreText);
    }

    updateScore(score: number) {
        this.scoreText.text = `Score: ${score}`;
    }
}
```

## 🚀 Quick Start Commands

```bash
# 1. Create project directory
mkdir my-pixijs-game && cd my-pixijs-game

# 2. Copy .cursorrules file to root
# 3. Create package.json and install dependencies
npm init -y
npm install pixi.js@^8.6.6
npm install -D typescript vite @types/node

# 4. Create file structure
mkdir -p src/core src/systems src/utils

# 5. Copy all template files above
# 6. Start development
npm run dev
```

## 📝 Notes

- Copy `.cursorrules` file to your project root for Cursor IDE support
- All files are ready to use with PixiJS v8
- Template includes basic game structure with interactive elements
- Follow the patterns in `.cursorrules` for best practices
- Add your game logic to the template structure 