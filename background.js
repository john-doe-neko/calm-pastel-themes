// background.js
const THEMES = [
  "theme1.css",
  "theme2.css",
  "theme3.css",
  "theme4.css",
  "theme5.css"
];

const DEFAULT_THEME_INDEX = 0; // какая тема по умолчанию

browser.storage.local.get("selectedTheme", (data) => {
  let index = data.selectedTheme ?? DEFAULT_THEME_INDEX;
  updateContentScriptCSS(index);
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.selectedTheme) {
    updateContentScriptCSS(changes.selectedTheme.newValue);
  }
});

async function updateContentScriptCSS(themeIndex) {
  // В MV3 нельзя динамически менять content_scripts css
  // Поэтому самый простой и надёжный способ — перезагружать вкладки
  // Альтернатива: использовать programmatic injection (ниже)

  // Вариант 1 — самый простой (требует перезагрузки вкладки)
  // browser.tabs.reload();

  // Вариант 2 — инъекция без перезагрузки (рекомендую)
  const themeFile = THEMES[themeIndex] || THEMES[0];

  // Удаляем предыдущие инъекции (по возможности)
  try {
    await browser.scripting.removeCSS({
      files: THEMES,
      allFrames: true
    });
  } catch (e) {
    // игнорируем, если стили ещё не были добавлены
  }

  await browser.scripting.insertCSS({
    files: [themeFile],
    allFrames: true
  });
}