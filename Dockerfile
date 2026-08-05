# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:18.15-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
# npm install (not npm ci) tolerates lockfile drift; .npmrc skips peer-dep conflicts
RUN npm install --legacy-peer-deps

COPY . .

# Vite embeds VITE_* at build time — override via docker build --build-arg
ARG VITE_APP_NAME=NexaIQ
ARG VITE_API_BASE_URL=/api
ARG VITE_MOCK_AUTH=true
ARG VITE_MOCK_API=false
ARG VITE_OIDC_PROVIDER=entra
ARG VITE_OIDC_AUTHORITY=
ARG VITE_OIDC_CLIENT_ID=
ARG VITE_OIDC_REDIRECT_URI=
ARG VITE_OIDC_POST_LOGOUT_REDIRECT_URI=
ARG VITE_OIDC_SCOPE=openid profile email

ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_MOCK_AUTH=$VITE_MOCK_AUTH \
    VITE_MOCK_API=$VITE_MOCK_API \
    VITE_OIDC_PROVIDER=$VITE_OIDC_PROVIDER \
    VITE_OIDC_AUTHORITY=$VITE_OIDC_AUTHORITY \
    VITE_OIDC_CLIENT_ID=$VITE_OIDC_CLIENT_ID \
    VITE_OIDC_REDIRECT_URI=$VITE_OIDC_REDIRECT_URI \
    VITE_OIDC_POST_LOGOUT_REDIRECT_URI=$VITE_OIDC_POST_LOGOUT_REDIRECT_URI \
    VITE_OIDC_SCOPE=$VITE_OIDC_SCOPE

RUN npm run build

# ── Serve stage (HTTPS with self-signed cert) ────────────────────────────────
FROM nginx:alpine

RUN apk add --no-cache openssl gettext

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
