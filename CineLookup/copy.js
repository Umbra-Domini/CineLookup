(() => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    navigator.clipboard.writeText(selectedText).catch(err => {
      console.warn("Clipboard write failed, trying execCommand fallback:", err);
      const textarea = document.createElement("textarea");
      textarea.value = selectedText;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (e) {
        console.error("Fallback copy failed:", e);
      }
      document.body.removeChild(textarea);
    });
  }
})();
