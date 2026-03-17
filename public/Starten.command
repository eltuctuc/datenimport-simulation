#!/bin/bash
# Datenimport-Simulation — macOS Starter
# Doppelklick startet einen lokalen Webserver und öffnet die App im Browser.

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8080

# Freien Port suchen, falls 8080 belegt ist
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

echo "=================================="
echo "  Datenimport-Simulation"
echo "=================================="
echo ""

if command -v python3 >/dev/null 2>&1; then
  echo "Starte Server auf http://localhost:$PORT ..."
  python3 -m http.server $PORT --directory "$DIR" --bind 127.0.0.1 >/dev/null 2>&1 &
  SERVER_PID=$!
  sleep 0.8
  open "http://localhost:$PORT"
  echo "App geöffnet. Dieses Fenster offen lassen."
  echo "Zum Beenden: Ctrl+C drücken oder Fenster schließen."
  echo ""
  wait $SERVER_PID
elif command -v python >/dev/null 2>&1; then
  python -m SimpleHTTPServer $PORT &
  SERVER_PID=$!
  sleep 0.8
  open "http://localhost:$PORT"
  wait $SERVER_PID
else
  echo "FEHLER: Python 3 nicht gefunden."
  echo "Bitte installieren Sie Python 3 von https://python.org"
  echo "oder öffnen Sie einen Terminal und führen Sie aus:"
  echo "  npx serve '$DIR'"
  read -p "Drücken Sie Enter zum Schließen..."
fi
