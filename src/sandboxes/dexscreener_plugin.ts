export const life = 42
 
function sendMessage(message) {
  window.parent.postMessage(message, "*");
}

window.addEventListener("message", async function (event) {
  const source = event.source as {
    window: WindowProxy
  }
 
  console.log("recive event:", event)
  sendMessage({
    "action": "register",
    "data": {
      "hello": "world"
    }
  })
})


