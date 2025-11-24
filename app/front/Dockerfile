FROM nginx:stable-alpine

# Répertoire de travail
WORKDIR /usr/share/nginx/html

# Copier les fichiers statiques
COPY src/index.html .
COPY src/app.js .
# Le config.js par défaut peut être écrasé par un ConfigMap en k8s
COPY src/config.js ./config.js

# Copier la conf nginx
COPY nginx.conf /etc/nginx/nginx.conf
