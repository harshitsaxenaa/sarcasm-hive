document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('loadSummaryBtn').addEventListener('click', loadSummary);
  document.getElementById('postToHiveBtn').addEventListener('click', postToHive);
});

function loadSummary() {
  console.log("Trying to fetch sarcasm_summary.txt...");
  fetch('sarcasm_summary.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error: ' + response.status);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('summaryBox').innerText = data;
      console.log("Loaded summary:", data);
    })
    .catch(err => {
      console.error('Error loading file:', err.message);
      alert('Error loading file: ' + err.message);
    });
}

function postToHive() {
  const username = document.getElementById('username').value;
  const body = document.getElementById('summaryBox').innerText;

  if (!username || !body) {
    alert("Username or summary is missing!");
    return;
  }

  const permlink = `sarcasm-results-${Date.now()}`;
  const title = 'Sarcasm Detection Results';
  const parentPermlink = 'hive';
  const parentAuthor = '';
  const jsonMetadata = {};

  if (window.hive_keychain) {
    hive_keychain.requestBroadcast(
      username,
      [
        [
          "comment",
          {
            parent_author: parentAuthor,
            parent_permlink: parentPermlink,
            author: username,
            permlink: permlink,
            title: title,
            body: body,
            json_metadata: JSON.stringify(jsonMetadata)
          }
        ]
      ],
      "posting",
      function(response) {
        if (response.success) {
          alert("Successfully posted to Hive via Keychain!");
        } else {
          alert("Posting failed: " + response.message);
        }
      }
    );
  } else {
    alert("Hive Keychain extension not found. Please install it in your browser.");
  }
}
