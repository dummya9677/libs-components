#!/bin/sh
set -e

CERT_DIR=/etc/nginx/ssl
CERT_FILE="${CERT_DIR}/cert.pem"
KEY_FILE="${CERT_DIR}/key.pem"
SSL_HOST="${SSL_HOST:-localhost}"
SSL_DAYS="${SSL_DAYS:-365}"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes \
    -days "$SSL_DAYS" \
    -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -subj "/CN=${SSL_HOST}/O=Local Dev/C=US"
  echo "Generated self-signed certificate for CN=${SSL_HOST} (${SSL_DAYS} days)"
fi

exec nginx -g 'daemon off;'
