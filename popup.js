document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".theme-btn");

  browser.storage.local.get("selectedTheme", (data) => {
    const current = data.selectedTheme ?? 0;
    buttons[current].classList.add("active");
  });

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const index = parseInt(btn.dataset.theme);

      await browser.storage.local.set({ selectedTheme: index });
      
      // Визуальная обратная связь
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Сообщаем background.js (на всякий случай)
      browser.runtime.sendMessage({ action: "themeChanged", index });
    });
  });
});