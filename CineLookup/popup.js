chrome.runtime.sendMessage({ type: "getHistory" }, response => {
  const terminal = document.getElementById("terminal");

  if (response?.history?.length) {
    response.history.forEach(item => {
      const line = document.createElement("div");
      line.className = "line";

      const textWrapper = document.createElement("div");
      textWrapper.className = "line-text";
      textWrapper.textContent = item;

      const button = document.createElement("button");
      button.className = "copy-btn";
      button.textContent = "[copy]";
      button.title = "Copy to clipboard";

      button.onclick = () => {
        navigator.clipboard.writeText(item).then(() => {
          button.textContent = "[copied]";
          setTimeout(() => {
            button.textContent = "[copy]";
          }, 1000);
        }).catch(err => {
          console.error("Copy failed:", err);
        });
      };

      line.appendChild(textWrapper);
      line.appendChild(button);
      terminal.appendChild(line);
    });
  } else {
    terminal.textContent = "No searches yet.";
    terminal.classList.add("empty");
  }
});
