# README.md — POC DataPress (DevOps / Conteneurisation / Kubernetes / CI-CD)

## 1. Objectif du POC

Ce POC répond à la demande de la DSI DataPress.  
Il vise à :

- séparer Front et API,
- conteneuriser les composants,
- proposer un environnement de développement simple,
- déployer un environnement de recette sous Kubernetes,
- mettre en place un début de CI/CD via GitHub Actions.

Ce document regroupe l’ensemble des informations nécessaires pour exécuter, comprendre, déployer et maintenir le POC.

---

## 2. Arborescence du projet

```
datapress-poc/
  README.md

  docker-compose.yml

  app/
    api/
      main.py
      requirements.txt
      Dockerfile
      .dockerignore
    front/
      Dockerfile
      .dockerignore
      nginx.conf
      src/
        index.html
        app.js
        config.js

  k8s/
    namespace.yaml
    configmap.yaml
    secret.yaml
    api-deployment.yaml
    api-service.yaml
    front-deployment.yaml
    front-service-nodeport.yaml

  .github/
    workflows/
      ci-api.yml

  docs/
    tech-doc.md
    presentation-outline.md
```

---

## 3. Prérequis

### Outils nécessaires

| Outil | Version conseillée | Rôle |
|-------|---------------------|------|
| Docker | 20+ | Conteneurisation |
| Docker Compose | v2 | Mode développement |
| kubectl | 1.25+ | Déploiement Kubernetes |
| Minikube / Kind / Cluster Kubernetes | — | Environnement recette |
| Git | — | Récupération du dépôt |
| GitHub | — | CI/CD |

---

## 4. Lancement du projet en mode développement (Docker Compose)

Le mode développement ne nécessite aucune installation de dépendances locales : tout tourne dans des conteneurs.

### 4.1. Cloner le dépôt

```bash
git clone https://github.com/<ton-user>/datapress-poc.git
cd datapress-poc
```

### 4.2. Lancer les services

```bash
docker compose up --build
```

Les services seront disponibles sur :

| Service | URL |
|--------|-----|
| API | http://localhost:8000 |
| Front | http://localhost:8080 |

### 4.3. Tester les endpoints API

```bash
curl http://localhost:8000/
curl http://localhost:8000/health
```

### 4.4. Tester via le front

Ouvrir :

```
http://localhost:8080
```

Deux actions sont possibles :

- Appel du endpoint `/`
- Appel du endpoint `/health`

---

## 5. Construction manuelle des images Docker

### API

```bash
docker build -t datapress-api:local ./app/api
```

### Front

```bash
docker build -t datapress-front:local ./app/front
```

---

## 6. Publication d'une image vers un registre Docker

### Connexion à GitHub Container Registry (GHCR)

```bash
echo "$GH_PAT" | docker login ghcr.io -u <ton-user> --password-stdin
```

### Tag des images

```bash
docker tag datapress-api:local ghcr.io/<ton-user>/datapress-api:latest
docker tag datapress-front:local ghcr.io/<ton-user>/datapress-front:latest
```

### Push

```bash
docker push ghcr.io/<ton-user>/datapress-api:latest
docker push ghcr.io/<ton-user>/datapress-front:latest
```

---

## 7. Déploiement Kubernetes (environnement de recette)

Avant toute action, vérifier que :

- les images utilisées dans `api-deployment.yaml` et `front-deployment.yaml` pointent bien vers votre registre,
- `kubectl` pointe vers votre cluster cible.

### 7.1. Création du namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### 7.2. Déploiement de la configuration

ConfigMap (configuration front) :

```bash
kubectl apply -f k8s/configmap.yaml
```

Secret (token API) :

```bash
kubectl apply -f k8s/secret.yaml
```

### 7.3. Déploiement de l’API

```bash
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/api-service.yaml
```

### 7.4. Déploiement du front

```bash
kubectl apply -f k8s/front-deployment.yaml
kubectl apply -f k8s/front-service-nodeport.yaml
```

### 7.5. Vérification du déploiement

```bash
kubectl get all -n datapress-recette
kubectl get events -n datapress-recette --sort-by=.lastTimestamp
```

### 7.6. Vérifier les logs

API :

```bash
kubectl logs -n datapress-recette deploy/datapress-api
```

Front :

```bash
kubectl logs -n datapress-recette deploy/datapress-front
```

### 7.7. Accéder au front via NodePort

```
http://<NODE_IP>:30080
```

---

## 8. CI/CD GitHub Actions

Le fichier CI/CD se trouve dans :

```
.github/workflows/ci-api.yml
```

### Fonctionnalités du workflow CI

- S’exécute sur `push` et `pull_request`,
- Récupère le dépôt,
- Build l’image Docker de l’API,
- Permet de valider automatiquement que l’API est toujours buildable.

---

## 9. Troubleshooting

### Le front affiche "API non configurée"

Vérifier :

- En dev : `app/front/src/config.js` doit contenir `http://localhost:8000`,
- En recette : le ConfigMap doit monter correctement `config.js` dans le conteneur.

### L’API retourne "degraded" sur `/health`

Cela signifie que la variable d’environnement `API_TOKEN` n’est pas définie.

En mode recette, vérifier :

```bash
kubectl describe secret datapress-secret -n datapress-recette
```

### Impossible d’accéder au front sur NodePort

Vérifier :

```bash
kubectl get svc -n datapress-recette
```

Vérifier que le port 30080 est bien exposé.

---

## 10. Documentation additionnelle

Ce dépôt contient également :

- `docs/tech-doc.md` : documentation technique complète,
- `docs/presentation-outline.md` : plan de présentation pour la soutenance.
