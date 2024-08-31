# Algonius

Algonius是一个强大的Chrome浏览器插件,为加密货币交易者提供智能化、自动化的量化交易解决方案。

## 功能特点

- 多DEX支持：从多个去中心化交易所获取实时K线数据
- AI驱动决策：利用可配置的AI模型生成交易信号
- 自动交易执行：支持多链自动交易
- 内置钱包：安全管理您的数字资产
- 实时市场分析：技术指标计算和新闻情感分析
- 用户友好界面：直观的策略配置和交易监控

## 安装

1. 克隆仓库:
   ```
   git clone https://github.com/algonius/algonius.git
   ```
2. 在Chrome浏览器中打开`chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择克隆的`algonius`文件夹

## 使用指南

详细的使用说明请参考我们的[用户手册](docs/user-manual.md)。

## 开发

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

如果您想为Algonius做出贡献,请查看我们的[开发者指南](docs/developer-guide.md)。

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.


## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## 安全性

Algonius高度重视用户的资产安全。我们采用了多重安全措施,包括数据加密、安全通信等。详情请参阅我们的[安全文档](docs/security.md)。

## 贡献

我们欢迎社区贡献!请查看[贡献指南](CONTRIBUTING.md)了解如何参与项目开发。

## 许可证

本项目采用MIT许可证 - 详情请见[LICENSE](LICENSE)文件。

## 联系我们

如有任何问题或建议,请通过以下方式联系我们:

- Email: support@algonius.com
- Twitter: [@algoniusapp](https://twitter.com/algoniusapp)
- Discord: [Algonius社区](https://discord.gg/algonius)
