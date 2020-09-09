const removeCachedAuthToken = (accessToken) => {
  // Remove token from the token cache.
  chrome.identity.removeCachedAuthToken(
    {
      token: accessToken,
    },
    () => {
      alert("finish revoke");
    }
  );
};

const printContacts = (token) => {
  fetch("https://people.googleapis.com/v1/contactGroups/all?maxMembers=20", {
    method: "GET",
    async: true,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    contentType: "json",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("contacts data:", data);
    });
};

const revokeAuthToken = (accessToken) => {
  // Make a request to revoke token
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://accounts.google.com/o/oauth2/revoke?token=" + accessToken
  );
  xhr.send();
  removeCachedAuthToken(accessToken);
};

window.onload = () => {
  let accessToken = "";

  document.querySelector("#auth").addEventListener("click", () => {
    chrome.identity.getAuthToken(
      { interactive: true },
      (token, grantedScopes) => {
        alert("auth success");
        console.log("got token", token, grantedScopes);
        accessToken = token;
      }
    );
  });

  document.querySelector("#revoke").addEventListener("click", () => {
    revokeAuthToken(accessToken);
  });

  document.querySelector("#show").addEventListener("click", () => {
    printContacts(accessToken);
  });
};
