from flask import Flask, jsonify
from datetime import datetime
import os

app = Flask(__name__)


@app.route("/", methods=["GET"])
def root():
    return jsonify(
        {
            "service": "datapress-api",
            "version": "v1.0-poc",
            "environment": os.getenv("ENVIRONMENT", "dev"),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )


@app.route("/health", methods=["GET"])
def health():
    # On simule l'utilisation d'un secret (API_TOKEN)
    api_token = os.getenv("API_TOKEN", None)
    status = "ok" if api_token else "degraded"

    return jsonify(
        {
            "status": status,
            "api_token_configured": bool(api_token),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )


if __name__ == "__main__":
    # Pour le dev local uniquement. En conteneur on utilisera gunicorn.
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
