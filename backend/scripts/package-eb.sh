#!/usr/bin/env bash
set -euo pipefail

# This script creates an Elastic Beanstalk compatible zip archive.
# It ensures that package.json and the rest of the application files
# are at the root of the archive and excludes files that EB can rebuild.

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/deploy"
ARCHIVE_NAME="imagicity-backend-eb.zip"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

(
  cd "$PROJECT_ROOT"
  if [[ -f package-lock.json || -f npm-shrinkwrap.json ]]; then
    npm ci --ignore-scripts --omit=dev
  else
    npm install --ignore-scripts --omit=dev
  fi
  zip -r9 "$OUTPUT_DIR/$ARCHIVE_NAME" . -x "node_modules/*" "deploy/*" \
    "scripts/*" "*.log" "uploads/*" "storage/uploads/*"
)

echo "Created $OUTPUT_DIR/$ARCHIVE_NAME"
