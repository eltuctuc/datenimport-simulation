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

  # SPA-fähiger Mini-Server: unbekannte Pfade → index.html
  python3 - "$PORT" "$DIR" <<'PYEOF' &
import sys, http.server, os
from pathlib import Path

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = Path(self.directory + self.path.split('?')[0])
        if not p.exists() or p.is_dir():
            self.path = '/index.html'
        return super().do_GET()
    def log_message(self, *a):
        pass

port = int(sys.argv[1])
os.chdir(sys.argv[2])
with http.server.HTTPServer(('127.0.0.1', port), SPAHandler) as s:
    s.serve_forever()
PYEOF

  SERVER_PID=$!
  sleep 0.8
  open "http://localhost:$PORT"
  echo "App geöffnet. Dieses Fenster offen lassen."
  echo "Zum Beenden: Ctrl+C drücken oder Fenster schließen."
  echo ""
  wait $SERVER_PID
else
  echo "FEHLER: Python 3 nicht gefunden."
  echo "Bitte installieren Sie Python 3 von https://python.org"
  read -p "Drücken Sie Enter zum Schließen..."
fi
