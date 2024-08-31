# Algonius - 智能加密货币量化交易插件

Algonius 是一款强大的 Chrome 浏览器插件，旨在为加密货币交易者提供智能化、自动化的量化交易解决方案。通过 Algonius，您可以轻松配置交易策略，实时监控市场动态，并自动执行交易，最大化您的投资收益。

## 主要功能

* **多 DEX 支持：** 从多个去中心化交易所获取实时 K 线数据，捕捉更多交易机会。
* **AI 驱动决策：** 利用可配置的 AI 模型生成交易信号，助您做出更明智的投资决策。
* **自动交易执行：** 支持多链自动交易，解放您的双手，让交易更加高效。
* **内置钱包：** 安全管理您的数字资产，无需担心资金安全。
* **实时市场分析：** 提供技术指标计算和新闻情感分析，助您全面了解市场行情。
* **用户友好界面：** 直观的策略配置和交易监控界面，即使是新手也能轻松上手。

## 安装

1. **克隆仓库:**
   ```bash
   git clone https://github.com/algonius/algonius.git
   ```
2. 在 Chrome 浏览器中打开 `chrome://extensions/`
3. 启用 "开发者模式"
4. 点击 "加载已解压的扩展程序"
5. 选择克隆的 `algonius` 文件夹

## 使用指南

详细的使用说明请参考我们的 [用户手册](docs/user-manual.md)。

## 开发

Algonius 是一个基于 [Plasmo](https://docs.plasmo.com/) 构建的扩展程序项目。

**开发环境搭建:**

1. 确保已安装 Node.js 和 pnpm。
2. 运行以下命令安装依赖：

   ```bash
   pnpm install
   ```

**启动开发服务器:**

```bash
pnpm dev
```

浏览器将自动打开并加载扩展程序。您可以修改 `popup.tsx` 文件来自定义弹出窗口界面。

**构建生产版本:**

```bash
pnpm build
```

构建完成后，您可以在 `build` 目录中找到打包好的扩展程序文件。

**目录结构:**

- `assets/`: 存放静态资源文件
  - `images/`: 图片文件
  - `icons/`: 图标文件
- `src/`: 源代码目录
  - `components/`: 可复用的 React 组件
    - `common/`: 通用组件（如按钮、输入框）
    - `charts/`: 图表相关组件
    - `forms/`: 表单相关组件
    - `layout/`: 布局相关组件
  - `pages/`: 插件的各个页面组件
    - `dashboard/`: 仪表盘页面
    - `trade-monitor/`: 交易监控页面
    - `strategy-config/`: 策略配置页面
    - `wallet-management/`: 钱包管理页面
    - `settings/`: 设置页面
  - `modules/`: 核心功能模块
    - `data-collection/`: 数据收集模块
    - `data-processing/`: 数据处理模块
    - `ai-decision/`: AI 决策模块
    - `trade-execution/`: 交易执行模块
    - `wallet/`: 钱包功能模块
  - `services/`: 外部 API 服务接口
    - `ai/`: AI 服务接口
    - `blockchain/`: 区块链服务接口
  - `scrapers/`: 网页数据抓取模块
    - `dex/`: 去中心化交易所数据抓取
    - `news/`: 新闻数据抓取
  - `utils/`: 工具函数和常量
    - `formatters/`: 数据格式化工具
    - `validators/`: 数据验证工具
    - `constants/`: 常量定义
  - `hooks/`: 自定义 React hooks
  - `types/`: TypeScript 类型定义文件

**更多开发信息:**

* [Plasmo 文档](https://docs.plasmo.com/)
* [开发者指南](docs/developer-guide.md)

## 发布到应用商店

您可以使用 Plasmo 内置的 [bpp](https://bpp.browser.market) GitHub Action 自动发布扩展程序到应用商店。 详细步骤请参考 [Plasmo 发布指南](https://docs.plasmo.com/framework/workflows/submit)。

## 安全性

Algonius 高度重视用户的资产安全。我们采取了多重安全措施，包括数据加密、安全通信等，以确保您的资产安全。 更多信息请参考我们的 [安全文档](docs/security.md)。

## 贡献

我们欢迎社区贡献！如果您想参与 Algonius 的开发，请查看我们的 [贡献指南](CONTRIBUTING.md)。

## 许可证

本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。

## 联系我们

如有任何问题或建议，请通过以下方式联系我们:

* **Email:** support@algonius.com
* **Twitter:** [@algoniusapp](https://twitter.com/algoniusapp)
* **Discord:** [Algonius 社区](https://discord.gg/algonius)
