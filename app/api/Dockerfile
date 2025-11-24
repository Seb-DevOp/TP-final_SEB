# ---------- STAGE 1 : build ----------
FROM python:3.12-slim AS builder

WORKDIR /app

# Installer les dépendances de build minimales
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
 && pip install --prefix=/install -r requirements.txt

COPY . .

# ---------- STAGE 2 : runtime ----------
FROM python:3.12-slim AS runtime

# Créer un utilisateur non-root
RUN useradd -m -u 1001 datapress

WORKDIR /app

# Copier les libs Python depuis le builder
COPY --from=builder /install /usr/local

# Copier le code applicatif
COPY . .

# Définir les variables d'env par défaut
ENV PORT=8000 \
    ENVIRONMENT=prod \
    PYTHONUNBUFFERED=1

USER datapress

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "main:app"]
