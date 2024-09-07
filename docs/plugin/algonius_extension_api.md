# Algonius Extension API for Plugins

This document outlines the API provided by the Algonius browser extension for use by plugins. These APIs allow plugins to interact with browser tabs, manage cookies, make network requests, access page content, and perform various DOM operations.

## Communication Protocol

Plugins can call these APIs using the `window.postMessage` method. The extension will listen for these messages and respond accordingly.

**Request Format:**
```json
{
  "type": "algonius_api_request",
  "id": "<unique_request_id>",
  "action": "<action_name>",
  "params": <action_parameters>
}
```

**Response Format:**
```json
{
  "type": "algonius_api_response",
  "id": "<corresponding_request_id>",
  "success": true/false,
  "data": <response_data>,
  "error": "<error_message_if_any>"
}
```

## Available Actions

### 1. Tab Management

#### 1.1 Open New Tab
- Action Name: `openTab`
- Parameters:
  - `url`: string (URL to open)
- Returns: Tab ID

#### 1.2 Close Tab
- Action Name: `closeTab`
- Parameters:
  - `tabId`: number
- Returns: Boolean (success status)

#### 1.3 Get Active Tabs
- Action Name: `getActiveTabs`
- Parameters: None
- Returns: Array of tab objects

#### 1.4 Search Tabs
- Action Name: `searchTabs`
- Parameters:
  - `query`: string
- Returns: Array of matching tab objects

### 2. Cookie Management

#### 2.1 Get Tab Cookies
- Action Name: `getTabCookies`
- Parameters:
  - `tabId`: number
- Returns: Array of cookie objects

### 3. Network Requests

#### 3.1 Make Network Request
- Action Name: `makeRequest`
- Parameters:
  - `tabId`: number
  - `url`: string
  - `method`: string
  - `headers`: object (optional)
  - `body`: string (optional)
- Returns: Response object

### 4. Page Content and DOM Operations

#### 4.1 Get Tab HTML Content
- Action Name: `getTabHTML`
- Parameters:
  - `tabId`: number
- Returns: String (HTML content)

#### 4.2 Click Element
- Action Name: `clickElement`
- Parameters:
  - `tabId`: number
  - `selector`: string (jQuery selector)
- Returns: Boolean (success status)

#### 4.3 Input Text
- Action Name: `inputText`
- Parameters:
  - `tabId`: number
  - `selector`: string (jQuery selector)
  - `text`: string (text to input)
- Returns: Boolean (success status)

#### 4.4 Scroll Page
- Action Name: `scrollPage`
- Parameters:
  - `tabId`: number
  - `direction`: string ("up" or "down")
  - `amount`: number (pixels to scroll)
- Returns: Boolean (success status)

#### 4.5 Wait For Selector
- Action Name: `waitForSelector`
- Parameters:
  - `tabId`: number
  - `selector`: string
  - `timeout`: number (optional, in milliseconds)
- Returns: Boolean (success status)

#### 4.6 Get Element Text
- Action Name: `getElementText`
- Parameters:
  - `tabId`: number
  - `selector`: string
- Returns: String (text content of the element)

#### 4.7 Take Screenshot
- Action Name: `takeScreenshot`
- Parameters:
  - `tabId`: number
  - `selector`: string (optional, for element screenshot)
- Returns: Base64 encoded string (screenshot image)

## Usage Examples

Here are examples of how to use these APIs:

```javascript
// Open a new tab
window.postMessage({
  type: "algonius_api_request",
  id: "open1",
  action: "openTab",
  params: { url: "https://www.example.com" }
}, "*");

// Click an element
window.postMessage({
  type: "algonius_api_request",
  id: "click1",
  action: "clickElement",
  params: { tabId: 123, selector: "#submit-button" }
}, "*");

// Input text
window.postMessage({
  type: "algonius_api_request",
  id: "input1",
  action: "inputText",
  params: { tabId: 123, selector: "#search-box", text: "Algonius" }
}, "*");

// Scroll page
window.postMessage({
  type: "algonius_api_request",
  id: "scroll1",
  action: "scrollPage",
  params: { tabId: 123, direction: "down", amount: 500 }
}, "*");

// Wait for selector
window.postMessage({
  type: "algonius_api_request",
  id: "wait1",
  action: "waitForSelector",
  params: { tabId: 123, selector: ".result-item", timeout: 5000 }
}, "*");

// Evaluate JavaScript
window.postMessage({
  type: "algonius_api_request",
  id: "eval1",
  action: "evaluateJS",
  params: { tabId: 123, script: "return document.title;" }
}, "*");
```

## Security Considerations

- Plugins should use these APIs responsibly and respect user privacy.
- The Algonius extension will implement necessary security checks to prevent misuse of these APIs.
- Sensitive operations may require user confirmation.
- DOM manipulation and JavaScript evaluation capabilities should be used with extreme caution. Plugins must ensure they do not interfere with the normal functioning of websites or compromise user data.
- The Algonius extension may implement additional security measures, such as user prompts or whitelisting, for sensitive operations like clicking elements or inputting text.

## Error Handling

If an API call fails, the response will include an `error` field with a description of the error. Plugins should handle these errors gracefully.

## API Versioning

This document describes version 1.1 of the Algonius Extension API.

## Limitations

- These APIs are designed to work within the constraints of browser extensions. Some operations that are possible with full browser automation tools may not be available or may work differently in this context.
- Performance of these operations may vary depending on the complexity of the webpage and the operations being performed.

## Best Practices

- Use selectors that are as specific as possible to avoid unintended interactions with page elements.
- Implement proper error handling and timeouts in your plugins to deal with cases where elements may not be found or operations may fail.
- Be mindful of the impact your plugin's operations may have on webpage performance and user experience.
- Always consider the ethical implications of your plugin's actions, especially when interacting with web pages or handling user data.
