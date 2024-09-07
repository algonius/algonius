# Algonius 插件通信协议

本文档描述了 Algonius 浏览器扩展与其插件之间的通信协议。插件开发者需要根据自己提供的功能实现相应的协议接口。

## 1. 通用通信机制

所有插件与 Algonius 主扩展之间的通信都通过 `window.postMessage` 进行。消息格式如下：

**请求消息:**
```json
{
  "type": "request",
  "id": "<唯一请求ID>",
  "action": "<动作名称>",
  "data": <动作相关数据>
}
```

**响应消息:**
```json
{
  "type": "response",
  "id": "<对应请求的ID>",
  "success": true/false,
  "data": <响应数据>,
  "error": "<错误信息，如果有>"
}
```

## 2. 插件类型及其协议

### 2.1 数据源插件

数据源插件负责从特定来源获取数据，如交易所、新闻网站等。

**必须实现的方法：**

1. `fetchData(params: object): Promise<object>`
   - 参数：根据数据源需求定义
   - 返回：包含获取到的数据的对象

**示例：**

```javascript
window.addEventListener("message", async (event) => {
  if (event.data.type === "request" && event.data.action === "fetchData") {
    try {
      const data = await fetchData(event.data.data);
      window.parent.postMessage({
        type: "response",
        id: event.data.id,
        success: true,
        data: data
      }, "*");
    } catch (error) {
      window.parent.postMessage({
        type: "response",
        id: event.data.id,
        success: false,
        error: error.message
      }, "*");
    }
  }
});

async function fetchData(params) {
  // 实现数据获取逻辑
}
```

### 2.2 AI 策略插件

AI 策略插件负责根据输入数据生成交易信号。

**必须实现的方法：**

1. `generateSignal(data: object): Promise<object>`
   - 参数：包含市场数据、技术指标等的对象
   - 返回：包含交易信号的对象

**示例：**

```javascript
window.addEventListener("message", async (event) => {
  if (event.data.type === "request" && event.data.action === "generateSignal") {
    try {
      const signal = await generateSignal(event.data.data);
      window.parent.postMessage({
        type: "response",
        id: event.data.id,
        success: true,
        data: signal
      }, "*");
    } catch (error) {
      window.parent.postMessage({
        type: "response",
        id: event.data.id,
        success: false,
        error: error.message
      }, "*");
    }
  }
});

async function generateSignal(data) {
  // 实现 AI 策略逻辑
}
```

### 2.3 交易执行插件

交易执行插件负责在特定交易所执行交易操作。

**必须实现的方法：**

1. `placeOrder(order: object): Promise<object>`
   - 参数：包含订单详情的对象
   - 返回：包含订单执行结果的对象

2. `cancelOrder(orderId: string): Promise<boolean>`
   - 参数：订单 ID
   - 返回：取消是否成功的布尔值

**示例：**

```javascript
window.addEventListener("message", async (event) => {
  if (event.data.type === "request") {
    try {
      let result;
      if (event.data.action === "placeOrder") {
        result = await placeOrder(event.data.data);
      } else if (event.data.action === "cancelOrder") {
        result = await cancelOrder(event.data.data);
      }
      window.parent.postMessage({
        type: "response",
        id: event.data.id,
        success: true,
        data: result
      }, "*");
    } catch (error) {
      window.parent.postMessage({
        type: "response",
        id: event.data.id,
        success: false,
        error: error.message
      }, "*");
    }
  }
});

async function placeOrder(order) {
  // 实现下单逻辑
}

async function cancelOrder(orderId) {
  // 实现取消订单逻辑
}
```

## 3. 插件注册

插件在加载完成后，需要向 Algonius 主扩展注册自己。

**注册消息格式：**

```json
{
  "type": "register",
  "pluginType": "<插件类型>",
  "name": "<插件名称>",
  "version": "<插件版本>",
  "supportedActions": ["<支持的动作列表>"]
}
```

**示例：**

```javascript
window.parent.postMessage({
  type: "register",
  pluginType: "dataSource",
  name: "Binance Data Provider",
  version: "1.0.0",
  supportedActions: ["fetchData"]
}, "*");
```

## 4. 错误处理

所有插件应妥善处理可能出现的错误，并在响应消息中包含详细的错误信息。

## 5. 安全性考虑

- 插件应验证所有输入数据，防止潜在的注入攻击。
- 敏感数据（如 API 密钥）应安全存储，不应在消息中明文传输。
- 插件应遵循同源策略，只接受来自 Algonius 主扩展的消息。

## 6. 版本控制

插件应在注册时提供版本信息，以便 Algonius 主扩展能够处理不同版本的插件。

## 结语

遵循此协议，插件开发者可以创建与 Algonius 无缝集成的功能扩展。如有任何疑问，请联系 Algonius 开发团队。
