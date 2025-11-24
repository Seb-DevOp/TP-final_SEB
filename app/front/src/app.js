(function () {
  const apiUrl = (window.APP_CONFIG && window.APP_CONFIG.apiUrl) || "";

  const apiUrlSpan = document.getElementById("api-url");
  const resultDiv = document.getElementById("result");
  const btnRoot = document.getElementById("btn-root");
  const btnHealth = document.getElementById("btn-health");

  apiUrlSpan.textContent = apiUrl || "NON CONFIGURÉ";

  async function callApi(path) {
    if (!apiUrl) {
      resultDiv.textContent =
        "API non configurée. Vérifiez la variable apiUrl dans config.js / ConfigMap.";
      return;
    }

    try {
      const response = await fetch(apiUrl + path);
      const data = await response.json();
      resultDiv.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      resultDiv.textContent = "Erreur lors de l'appel à l'API : " + err;
    }
  }

  btnRoot.addEventListener("click", () => callApi("/"));
  btnHealth.addEventListener("click", () => callApi("/health"));
})();
