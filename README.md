# 少儿智趣成长与游戏中心 (Kids Arcade & Learning Hub)

> 🎮 5 合 1 沉浸式互动乐园：包含**人教版小学数学全册 17 单元具象工坊闯关平台（智趣学堂）**与 **4 款纯前端 3D 街机/沙盒神作**。
> 纯前端高性能架构，无需后端数据库，多端秒开，支持 GitHub Pages、Cloudflare Pages/Workers、Vercel 等平台一键免费部署。

---

## 🌟 平台核心模块

### 1. 📚 智趣学堂 · 小学生游戏化闯关平台 (`/scratch/`)
- **React 19 + Lucide** 现代全栈前端交互。
- 完整覆盖**人教版小学三年级数学全册 17 个单元核心知识点**。
- **具象工坊**：齿轮联动时分秒时钟、分数切披萨、周长红线与面积网格板、八方向小镇指南针等高自由度动手互动教具。
- **闭环系统**：名师概念导学、3 颗心血条闯关答题、单元领主魔王 Boss 战、错题本重练、17 枚黄金勋章墙与伴学小神龙。
- **双端适配**：智能支持电脑桌面端宽屏与移动手机端轻量竖屏。

### 2. 🎩 超级马里奥：奥德赛 3D (`/odyssey/`)
- 全 3D Three.js 帽子王国箱庭世界。
- 支持投掷凯比帽子旋转与悬停、踩帽二段超跳、附身变身板栗仔自由叠罗汉、收集 3 颗发光力量之月。

### 3. 🏁 马里奥赛车 8 豪华版 (`/kart/`)
- **双人同机左右对称独立分屏竞速**，视线绝不互相遮挡。
- 双方独立按键对战（1P: WASD/空格；2P: 方向键/回车），支持香蕉皮、火箭喷射与追踪龟壳道具互轰。

### 4. 🎮 超级马里奥兄弟 NES 经典 (`/mario/`)
- 100% 原汁原味复刻 1985 红白机像素经典。
- 1-1 平原、-1 水下循环关、-2 超速断桥与 1-4 库巴城堡斧头战；内置 5% 神抽无敌星与极限狂暴二周目模式。

### 5. ⛏️ 我的世界 3D 体素沙盒 (`/minecraft/`)
- 第一人称 3D 体素沙盒与无限程序化地形生成。
- 支持生存、创造、旁观与极限模式自由切换；完整合成台配方手册、动态水流与水桶、僵尸苦力怕怪物与村民交易系统。

---

## 🚀 本地开发与体验

### 1. 环境准备
确保电脑已安装 [Node.js](https://nodejs.org/)（推荐 Node 18+ 或更高版本）。

### 2. 安装依赖
在项目根目录下执行：
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```
启动成功后，浏览器打开 `http://localhost:3000/` 即可体验主大厅及全部应用。

### 4. 生产环境构建与本地预览
```bash
npm run build
npm run preview
```
生产构建产物将一键输出至 `dist/` 目录，单次构建耗时通常小于 1 秒。

---

## 🌐 免费平台一键部署指南

本工程经过专业的多页面架构优化（`base: './'`），产物中全站链接与静态资源均采用相对路径解析，无论在根域名还是二级子路径（如 `https://<username>.github.io/<repo>/`）均完美运行，无资源 404 隐患。

### 方案 A：GitHub Pages（全自动 CI/CD，推荐）
1. 将本仓库推送到您的 GitHub（例如分支为 `main`）。
2. 在仓库的 **Settings** -> **Pages** -> **Build and deployment** 中：
   - **Source** 选择 **`GitHub Actions`**。
3. 仓库内已内置工作流文件 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)，推送到 main 分支后将全自动构建并发布至 GitHub Pages。

---

### 方案 B：Cloudflare Pages / Workers（零成本全球边缘极速）

#### 方式 1：Cloudflare Pages (绑定 Git 自动部署)
1. 登录 Cloudflare Dashboard -> **Compute (Workers & Pages)** -> **Create application** -> **Pages**。
2. 连接 GitHub 仓库并选择本项目：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. 点击 **Save and Deploy**，即可获得全球 CDN 加速的免费 HTTPS 访问地址。

#### 方式 2：Cloudflare Workers / CLI 一键直发
工程已内置 [`wrangler.toml`](wrangler.toml)，在终端执行以下命令即可直发部署：
```bash
npm run deploy:cf
```

---

### 方案 C：Vercel / Netlify
1. 导入 Git 仓库，框架预设选择 `Vite`。
2. 构建命令填 `npm run build`，发布目录填 `dist`。
3. 根目录 `public/_headers` 与 `public/_redirects` 已预置最优缓存与路径规范。

---

## 📁 工程目录结构

```text
baby/
├── .github/workflows/deploy.yml    # GitHub Pages 自动化 CI/CD 流水线
├── public/                         # 静态公共资源
│   ├── favicon.svg                 # 网站专属全景图标
│   ├── _headers                    # Cloudflare 边缘缓存优化规则
│   └── _redirects                  # 自动处理二级路径末尾斜杠
├── scratch/                        # 📚 智趣学堂（React 19 + Lucide 学习平台）
│   ├── src/                        # 具象工坊组件、单元数据与状态机
│   └── index.html                  # 智趣学堂多页面入口
├── odyssey/                        # 🎩 超级马里奥：奥德赛 3D
├── kart/                           # 🏁 马里奥赛车 8 双人分屏竞技
├── mario/                          # 🎮 超级马里奥兄弟经典 NES 版
├── minecraft/                      # ⛏️ 我的世界 3D 体素沙盒版
├── index.html                      # 🌟 综合总门户大厅（双专区、分类筛选、全景统计）
├── package.json                    # 统一管理的依赖包与多平台部署脚本
├── vite.config.js                  # 统一 Vite MPA 多页面打包与 React 插件配置
└── wrangler.toml                   # Cloudflare Workers/Pages 边缘静态资源配置
```

---

## 💡 特性与双向导航闭环

- **相对路径全覆盖**：主大厅直达卡片与各游戏、学堂顶部的「🏠 返回大厅」按钮全部采用相对路径 `../`，子应用之间跳转平滑闭环。
- **离线与轻量**：纯前端执行，学情报告与游戏记录全部安全存放在客户端 `localStorage` 中。
