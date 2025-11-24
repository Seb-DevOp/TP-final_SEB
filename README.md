# DataPress – POC conteneurs & Kubernetes

Ce dépôt contient le POC demandé par la DSI de DataPress pour préparer
la modernisation de la plateforme interne via Docker, Kubernetes et un début de CI/CD.

## 1. Objectifs

- Séparer le front et l'API.
- Proposer un mode développement simple via Docker Compose.
- Déployer un environnement de recette sur Kubernetes avec :
  - namespace dédié,
  - Deployments, Services, ConfigMap, Secret,
  - probes de santé et ressources.
- Mettre en place un workflow CI minimal pour l'API.
- Fournir une documentation technique et une présentation "client".

## 2. Arborescence

Voir la section "Arborescence" dans les docs ou dans ce README.

## 3. Lancer le mode développement (Docker Compose)

Prérequis : Docker / Docker Compose installés.

```bash
docker compose up --build
