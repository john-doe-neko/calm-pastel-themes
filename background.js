// background.js
const THEMES = [
  "theme1.css",
  "theme2.css",
  "theme3.css",
  "theme4.css",
  "theme5.css"
];
let currentThemeIndex = 0;

browser.storage.local.get("selectedTheme", (data) => {
  currentThemeIndex = data.selectedTheme ?? 0;
  applyTheme(currentThemeIndex);
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.selectedTheme) {
    currentThemeIndex = changes.selectedTheme.newValue;
    applyTheme(currentThemeIndex);
  }
});

async function applyTheme(index) {
  const themeFile = THEMES[index] || THEMES[0];
  
  // Удаляем все предыдущие темы (чтобы не накапливались, а то потом с этим не разберёшься, я задолбался на кождую строку писать по3 новых)
  try {
    await browser.scripting.removeCSS({
      files: THEMES,
      target: { allFrames: true }
    });
  } catch (e) {} // если не было — нормально

  // Вставляем новую
  try {
    await browser.scripting.insertCSS({
      files: [themeFile],
      target: { allFrames: true },
      origin: "USER"   // ← важно! даёт приоритет выше авторских стилей сайта
    });
  } catch (err) {
    console.error("Ошибка инъекции:", err);
  }
}

// При смене вкладки или обновлении — тоже применяем (опционально,но я счиьаю что скорее необходимо)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {
    applyTheme(currentThemeIndex);
  }
});
