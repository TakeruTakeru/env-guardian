// 現在のタブのドメインを取得し、入力欄に自動入力
document.getElementById('getCurrentDomainButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    document.getElementById('domainInput').value = domain;
  });
});

// ドメインを追加するボタンの処理
document.getElementById('addButton').addEventListener('click', function() {
  const domain = document.getElementById('domainInput').value.trim();
  const color = document.getElementById('colorInput').value;
  const warningMethod = document.getElementById('warningMethod').value;
  const noteText = document.getElementById('note').value.trim();

  if (!domain) {
    displayFeedback("Domain cannot be empty.", "error");
    return;
  }

  if (warningMethod == "note" && !noteText) {
    displayFeedback("Note text cannot be empty.", "error");
    return;
  }

  chrome.storage.sync.get(["domains"], (data) => {
    const domains = data.domains || [];

    // ドメインがすでに存在するかを確認
    const existingDomain = domains.find(entry => entry.domain === domain);
    if (existingDomain) {
      displayFeedback("This domain is already registered.", "error");
      return;
    }

    // ドメインを登録
    domains.push({ domain: domain, color: color, method: warningMethod, noteText: noteText });
    chrome.storage.sync.set({ domains: domains }, () => {
      displayDomains();
      document.getElementById('domainInput').value = '';
      document.getElementById('colorInput').value = '#ff0000';
      document.getElementById('note').value = '';
      displayFeedback("Domain added successfully!", "success");
    });
  });
});

// 警告方法の切り替え
document.getElementById('warningMethod').addEventListener('change', function() {
  const method = this.value;
  const note = document.getElementById('note');

  if (method === 'note') {
    note.style.display = 'block';
  } else {
    note.style.display = 'none';
  }
});

// ドメインの色を更新
function updateDomainColor(index, newColor) {
  chrome.storage.sync.get(["domains"], (data) => {
    const domains = data.domains || [];
    domains[index].color = newColor;

    chrome.storage.sync.set({ domains: domains }, () => {
      displayDomains();
      displayFeedback("Color updated successfully!", "success");
    });
  });
}

// ドメインを削除
function removeDomain(index) {
  chrome.storage.sync.get(["domains"], (data) => {
    const domains = data.domains || [];
    domains.splice(index, 1);

    chrome.storage.sync.set({ domains: domains }, () => {
      displayDomains();
      displayFeedback("Domain removed successfully!", "success");
    });
  });
}

// フィードバックメッセージの表示
function displayFeedback(message, type) {
  const feedbackMessage = document.getElementById('feedbackMessage');
  feedbackMessage.textContent = message;
  feedbackMessage.style.display = 'block';

  if (type === 'success') {
    feedbackMessage.style.color = 'green';
  } else if (type === 'error') {
    feedbackMessage.style.color = 'red';
  }

  // 3秒後にメッセージを消す
  setTimeout(() => {
    feedbackMessage.style.display = 'none';
  }, 3000);
}

// ドメイン一覧を表示
function displayDomains() {
  chrome.storage.sync.get(["domains"], (data) => {
    const domains = data.domains || [];
    const domainsDiv = document.getElementById('domains');
    domainsDiv.innerHTML = '';

    domains.forEach((entry, index) => {
      const domainElement = document.createElement('div');
      domainElement.classList.add('domain-item');

      // ドメインと色の表示
      domainElement.innerHTML = `
        ${entry.domain}
        <input type="color" class="color-input" value="${entry.color}" data-index="${index}" />
        <br/>
        <strong>Method:</strong> ${entry.method}
        ${entry.method === 'note' ? `<br/><strong>Note text:</strong> ${entry.noteText}` : ''}
        <div class="button-group">
        <span class="update-button" data-index="${index}">Update</span>
        <span class="remove-button" data-index="${index}">Remove</span>
        </div>
      `;

      // 色を変更するイベント
      domainElement.querySelector('.update-button').addEventListener('click', function(e) {
        const index = e.target.getAttribute('data-index');
        const newColor = domainElement.querySelector('.color-input').value;
        updateDomainColor(index, newColor);
      });

      // ドメインを削除するイベント
      domainElement.querySelector('.remove-button').addEventListener('click', function(e) {
        const index = e.target.getAttribute('data-index');
        removeDomain(index);
      });

      domainsDiv.appendChild(domainElement);
    });
  });
}

// 初期化
displayDomains();
