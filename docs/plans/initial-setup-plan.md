# ecashskill 网站架构计划

## 1. 项目概述

**项目名称**: ecashskill
**项目类型**: 静态展示网站 / 文档站
**核心功能**: 为开发者提供 ecash 区块链相关的 AI 开发指南、skill md 和 cursor md 等资源
**目标用户**: 区块链开发者、ecash 生态参与者、AI 应用开发者

## 2. 技术栈

| 类别 | 技术选择 | 说明 |
|------|---------|------|
| 框架 | Next.js 14+ (App Router) | React 全栈框架 |
| UI 组件库 | shadcn/ui | 基于 Radix + Tailwind 的可定制组件库 |
| 样式 | Tailwind CSS | 原子化 CSS |
| 静态部署 | Vercel / GitHub Pages | 静态导出 (output: 'export') |
| 内容格式 | MDX | 支持 Markdown + React 组件 |
| 图标 | Lucide React | shadcn 默认图标库 |
| 字体 | Next/font (Geist) | Vercel 优化的字体加载 |

## 3. 目录结构

```
ecashskill/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD 部署流程
├── docs/
│   ├── plans/                  # 项目计划文档
│   │   └── initial-setup-plan.md
│   └── content/                # MDX 内容文件
│       ├── skills/             # Skill 开发指南
│       ├── guides/             # 教程指南
│       └── reference/          # 参考文档
├── public/
│   └── assets/                 # 静态资源
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── globals.css         # 全局样式
│   │   ├── (docs)/             # 文档路由组
│   │   │   ├── layout.tsx      # 文档布局
│   │   │   ├── skills/         # Skills 页面
│   │   │   ├── guides/         # Guides 页面
│   │   │   └── reference/      # Reference 页面
│   │   └── api/                # API 路由（如需要）
│   ├── components/
│   │   ├── ui/                # shadcn 组件
│   │   ├── layout/            # 布局组件 (Header, Footer, Sidebar)
│   │   ├── docs/              # 文档专用组件
│   │   └── home/              # 首页组件
│   ├── lib/
│   │   ├── utils.ts           # 工具函数
│   │   └── constants.ts       # 常量定义
│   └── content/               # 内容配置
│       ├── skills.ts          # Skills 列表
│       └── navigation.ts      # 导航配置
├── components.json            # shadcn 配置文件
├── tailwind.config.ts         # Tailwind 配置
├── next.config.js             # Next.js 配置
├── package.json
└── tsconfig.json
```

## 4. 页面结构

### 4.1 首页 (`/`)
- Hero 区域：项目介绍
- 特性展示卡片
- 快速导航入口（Skills / Guides / Reference）
- 最新内容列表

### 4.2 Skills 页面 (`/skills`)
- Skill 分类列表
- 每个 Skill 的简介卡片
- 搜索/筛选功能

### 4.3 Guides 页面 (`/guides`)
- 教程文章列表
- 按难度分类（入门/进阶/高级）

### 4.4 Reference 页面 (`/reference`)
- API 参考文档
- 开发资源链接

### 4.5 文档详情页 (`/skills/[slug]`, `/guides/[slug]`)
- MDX 渲染内容
- 侧边导航
- 代码高亮
- 目录索引

## 5. shadcn/ui 组件规划

### 必需组件
- [ ] Button
- [ ] Card
- [ ] Badge
- [ ] Separator
- [ ] Sheet (移动端侧边栏)
- [ ] Tabs
- [ ] ScrollArea

## 6. 开发阶段规划

### 阶段一：项目初始化
- [ ] 初始化 Next.js 项目
- [ ] 配置 Tailwind CSS
- [ ] 初始化 shadcn/ui
- [ ] 添加基础组件（Button, Card, Badge, Separator）
- [ ] 配置字体和全局样式
- [ ] 创建基础布局组件（Header, Footer, Sidebar）

### 阶段二：内容框架
- [ ] 创建首页
- [ ] 创建文档页面结构（Skills / Guides / Reference）
- [ ] 实现 MDX 渲染
- [ ] 创建示例内容

### 阶段三：部署
- [ ] 配置静态导出 (`output: 'export'`)
- [ ] 配置 Vercel 部署
- [ ] 配置 GitHub Actions CI/CD

## 7. 内容规划

### 7.1 初始内容（Demo）
- 示例 Skill：ecash 钱包连接
- 示例 Guide：快速入门教程
- 示例 Reference：API 速查表

### 7.2 内容配置规格

**`src/content/skills.ts`** - Skills 列表配置
```ts
export interface Skill {
  slug: string;
  title: string;
  description: string;
  category: 'wallet' | 'defi' | 'nft' | 'agent';
}
```

**`src/content/navigation.ts`** - 导航配置
```ts
export interface NavItem {
  title: string;
  href: string;
}
export const navigation: { main: NavItem[]; docs: NavItem[] };
```

## 8. 简化确认

- 内容管理：MDX 文件直写，无 CMS
- 搜索功能：无
- 国际化：无
- 部署平台：Vercel（推荐）

## 9. 依赖包清单

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "lucide-react": "latest",
    "next-mdx-remote": "^5.x",
    "gray-matter": "latest"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x"
  }
}
```

## 10. 下一步行动

1. 运行 `npx create-next-app@latest` 初始化项目
2. 选择以下选项：
   - TypeScript: **Yes**
   - ESLint: **Yes**
   - Tailwind CSS: **Yes**
   - src/ directory: **Yes**
   - App Router: **Yes**
   - Customize import alias: **Yes** (`@/*`)
3. 初始化 shadcn/ui: `npx shadcn-ui@latest init`
4. 添加基础组件
5. 开始构建首页

---

*计划制定日期: 2026-03-25*
*计划版本: v1.0*
