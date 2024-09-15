export const life = 42
 
window.addEventListener("message", async function (event) {
  const source = event.source as {
    window: WindowProxy
  }
 
  console.log("recive event:", event)
})

function sendMessage(message) {
  window.parent.postMessage(message, "*");
}
