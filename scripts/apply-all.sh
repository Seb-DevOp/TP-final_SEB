#!/usr/bin/env bash
set -euo pipefail

# S'assurer que le secret réel existe (copie depuis exemple si présent)
if [ -f "manifests/11-secret.yaml" ]; then
  echo "Utilisation de manifests/11-secret.yaml"
else
  echo "ERREUR: créez manifests/11-secret.yaml à partir de manifests/11-secret.example.yaml"
  exit 1
fi

kubectl apply -f manifests/00-namespace.yaml
kubectl apply -f manifests/10-configmap.yaml
kubectl apply -f manifests/11-secret.yaml
kubectl apply -f manifests/20-deploy-front.yaml
kubectl apply -f manifests/21-svc-front.yaml
kubectl apply -f manifests/30-deploy-api.yaml
kubectl apply -f manifests/31-svc-api.yaml
kubectl apply -f manifests/90-clusterissuer-selfsigned.yaml
kubectl apply -f manifests/99-ingress.yaml

echo "[OK] Manifests appliqués."
