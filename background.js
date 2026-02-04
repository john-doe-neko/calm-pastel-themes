const THEMES = [  "theme1.css",  "theme2.css",  "theme3.css",  "theme4.css",  "theme5.css"];
let currentThemeIndex = 0;
browser.storage.local.get("selectedTheme", (data) => {  currentThemeIndex = data.selectedTheme ?? 0;  applyTheme(currentThemeIndex);

});
browser.storage.onChanged.addListener((changes) => {  if (changes.selectedTheme) {    currentThemeIndex = changes.selectedTheme.newValue;
  applyTheme(currentThemeIndex);

}});
async function applyTheme(index) {  const themeFile = THEMES[index] || THEMES[0];
  try {    await browser.scripting.removeCSS({      files: THEMES,      target: { allFrames: true }    });  } catch (e) {}  try {    await browser.scripting.insertCSS({      files: [themeFile],      target: { allFrames: true },      origin: "USER"    });  } catch (err) {    console.error("Ошибка инъекции:", err);

  }}browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {    applyTheme(currentThemeIndex);

  }});
