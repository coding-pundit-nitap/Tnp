#!/bin/bash
# Database backup script - run via cron for scheduled backups
# Crontab example (daily at 2 AM):
#   0 2 * * * /path/to/project/scripts/backup-db.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Load env
source "$PROJECT_DIR/.env.production"

mkdir -p "$BACKUP_DIR"

echo "Backing up database..."
docker exec tnp-portal-db pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "$BACKUP_DIR/tnp_backup_${TIMESTAMP}.sql.gz"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo "Backup complete: tnp_backup_${TIMESTAMP}.sql.gz"
