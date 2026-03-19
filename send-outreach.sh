#!/usr/bin/env bash
# Send outreach emails to cooperativas in batches.
# Usage: ./send-outreach.sh [--dry-run] [--batch-size 28] [--delay 120]
#
# - Sends from enriquefft@404tf.com via SpaceMail
# - Tracks sent emails in outreach_sent.log (resume-safe)
# - Default: 28 emails per run, 2 min between sends

set -euo pipefail

CLI="/etc/nixos/zeroclaw/skills/email/cli.ts"
CSV="outreach_gmail_140.csv"
LOG="outreach_sent.log"
ACCOUNT="enriquefft@404tf.com"

BATCH_SIZE=28
DELAY=120
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --batch-size) BATCH_SIZE="$2"; shift 2 ;;
    --delay) DELAY="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

touch "$LOG"

sent_count=0
skipped=0
failed=0
total=$(tail -n +2 "$CSV" | wc -l)

echo "=== Outreach batch started at $(date) ==="
echo "Batch size: $BATCH_SIZE | Delay: ${DELAY}s | Dry run: $DRY_RUN"
echo ""

while IFS=',' read -r email razon_social departamento provincia; do
  # Skip header
  [[ "$email" == "EMAIL" ]] && continue

  # Skip if already sent
  if grep -qF "$email" "$LOG" 2>/dev/null; then
    skipped=$((skipped + 1))
    continue
  fi

  # Stop if batch limit reached
  if [[ $sent_count -ge $BATCH_SIZE ]]; then
    echo ""
    echo "Batch limit ($BATCH_SIZE) reached. Run again tomorrow for the next batch."
    break
  fi

  # Clean up coop name
  coop_short=$(echo "$razon_social" | sed 's/ LTDA\..*//;s/ Nº.*//;s/ N°.*//' | head -c 60)

  subject="Registro de ventas offline para productores — Chacra"

  body="Estimados $coop_short,

Soy Enrique Flores, de Chacra (chacra.404tf.com). Les escribo porque estamos construyendo una herramienta gratuita para cooperativas agrarias en $departamento y otras regiones del Peru.

Chacra permite a los productores registrar sus ventas desde el celular, incluso sin conexion a internet. La cooperativa obtiene trazabilidad en tiempo real y datos estructurados utiles para contratos de exportacion y acceso a credito.

Tenemos un demo funcional en chacra.404tf.com que pueden explorar.

Si les interesa probarlo con algunos de sus productores, me encantaria coordinar una llamada corta.

Quedo atento,
Enrique Flores
Chacra — chacra.404tf.com

PD: Si no desea recibir mas correos de nuestra parte, responda con REMOVER y no volveremos a contactarle."

  if $DRY_RUN; then
    echo "[$((sent_count + 1))/$BATCH_SIZE] [DRY RUN] $email ($coop_short, $departamento)"
  else
    echo -n "[$((sent_count + 1))/$BATCH_SIZE] Sending to $email ($coop_short)... "
    if bun "$CLI" send \
      --account "$ACCOUNT" \
      --to "$email" \
      --subject "$subject" \
      --body "$body" > /dev/null 2>&1; then
      echo "OK"
      echo "$(date -Iseconds) $email" >> "$LOG"
    else
      echo "FAILED"
      echo "$(date -Iseconds) FAILED $email" >> "${LOG}.errors"
      failed=$((failed + 1))
    fi
  fi

  sent_count=$((sent_count + 1))

  # Delay between sends (skip on last or dry run)
  if ! $DRY_RUN && [[ $sent_count -lt $BATCH_SIZE ]]; then
    echo "  Waiting ${DELAY}s..."
    sleep "$DELAY"
  fi
done < "$CSV"

echo ""
already_sent=$(wc -l < "$LOG")
echo "=== Batch complete ==="
echo "Sent: $sent_count | Skipped (already sent): $skipped | Failed: $failed"
echo "Progress: $already_sent / $total total"
[[ $already_sent -lt $total ]] && echo "Run again tomorrow for the next batch."
