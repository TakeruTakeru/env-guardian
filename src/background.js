chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.storage.sync.get(["domains"], (data) => {
      const domains = data.domains || [];

      const matchedDomain = domains.find((domainEntry) =>
        tab.url.includes(domainEntry.domain)
      );

      if (matchedDomain) {
        if (matchedDomain.method === "watermark") {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: addWatermark,
            args: [matchedDomain.color],
          });
        } else if (matchedDomain.method === "note") {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: addVerticalText,
            args: [matchedDomain.noteText, matchedDomain.color],
          });
        }
      }
    });
  }
});

function addWatermark(color) {
  const watermark = document.createElement("div");
  watermark.style.position = "fixed";
  watermark.style.top = "0";
  watermark.style.left = "0";
  watermark.style.width = "100vw";
  watermark.style.height = "100vh";
  watermark.style.backgroundColor = color;
  watermark.style.opacity = "0.1";
  watermark.style.pointerEvents = "none";
  watermark.style.zIndex = "9999";
  document.body.appendChild(watermark);
}

function addVerticalText(text, color) {
  const verticalText = document.createElement('div');
  verticalText.textContent = text;

  verticalText.style.position = 'fixed';
  verticalText.style.top = '10%';
  verticalText.style.left = '0';
  verticalText.style.transform = 'translateY(-50%)';  // 垂直方向に中央揃え
  verticalText.style.fontSize = '16px';
  verticalText.style.backgroundColor = color;
  verticalText.style.color = '#fff';
  verticalText.style.padding = '4px';
  verticalText.style.textOrientation = 'upright'; // 文字を回転させない
  verticalText.style.zIndex = '10000';
  verticalText.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  verticalText.style.pointerEvents = 'none';  // 背後の要素が操作できるようにする

  document.body.insertAdjacentElement("afterbegin", verticalText);
}
