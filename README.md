🧩 TP Kubernetes – Déploiement d’un Front + API avec TLS & Rollback
🎯 Objectif

Déployer une application complète sur Kubernetes K8s :

Un front statique (nginxdemos/hello) exposé via /front
Une API (mccutchen/go-httpbin) exposée via /api
Le tout derrière un Ingress NGINX unique

Sécurisé par un certificat TLS self-signed géré par cert-manager
Utilisation de ConfigMap (bannière front) et Secret (DB_USER/DB_PASS)
Mise en place d’un rollback pour gérer une release défectueuse

----
# Initialisation
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# Configuration kubectl
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
----

🔌 Réseau et CoreDNS

Installation du CNI Flannel
Désactivation du taint du control-plane
CoreDNS devient ensuite Running

kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
kubectl taint nodes --all node-role.kubernetes.io/control-plane-


----

🧱 2. Ingress & Cert-Manager

Le script install-ingress-certmgr.sh installe :
NGINX Ingress Controller (pour le routage HTTP/S)
cert-manager (pour les certificats TLS)

./scripts/install-ingress-certmgr.sh
kubectl -n ingress-nginx get pods
kubectl -n cert-manager get pods

----
🔐 3. Secrets & ConfigMaps
ConfigMap (paramètres front)

apiVersion: v1
kind: ConfigMap
metadata:
  name: front-config
  namespace: workshop
data:
  BANNER_TEXT: "Hello M2 IR"


Secret (identifiants DB)
./scripts/apply-all.sh

-----

| Élément                       | Rôle                                | Justification                                    |
| ----------------------------- | ----------------------------------- | ------------------------------------------------ |
| **kubeadm**                   | Création du cluster                 | Contrôle total et config simple                  |
| **Flannel**                   | Réseau pod                          | Compatible kubeadm + simple                      |
| **Ingress NGINX**             | Routage HTTP(S)                     | Standard Kubernetes                              |
| **cert-manager (selfsigned)** | Certificats TLS                     | Automatisation TLS sans dépendre d’AC externe    |
| **ConfigMap/Secret**          | Paramètres applicatifs              | Séparation des données sensibles et de la config |
| **Rewrite Ingress**           | Gestion des paths `/front` & `/api` | Simplifie les URLs côté client                   |
| **Rollback kubectl**          | Gestion de release                  | Démonstration de la résilience CI/CD             |



https://workshop.local/front
<img width="861" height="669" alt="image" src="https://github.com/user-attachments/assets/5fcae4f6-352a-4ef3-aa58-a0f3c03d557a" />

<img width="862" height="665" alt="image" src="https://github.com/user-attachments/assets/8f68dc82-ff4b-4979-b441-720431965da6" />

