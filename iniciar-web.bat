@echo off
chcp 65001 >nul
echo =========================================================
echo     BipEscola - Modo Web + Teste em Celulares no Colegio
echo =========================================================
echo.
echo [1/3] Gerando o aplicativo Web otimizado (mobile/dist)...
cd mobile
set NODE_OPTIONS=--max-old-space-size=4096
call npx expo export --platform web
cd ..

echo.
echo [2/3] Iniciando Servidor Unificado (API + Web App na porta 3000)...
start "BipEscola - Servidor Web + API (Porta 3000)" cmd /k "cd backend && npm start"

echo.
echo [3/3] Iniciando Tunel HTTPS Gratuito (Cloudflare Quick Tunnel)...
echo       Copie o link https://....trycloudflare.com que aparecera na nova janela
echo       e envie para os professores abrirem no navegador do celular (Chrome/Safari)!
start "BipEscola - Tunel HTTPS para Celulares" cmd /k "npx --yes cloudflared tunnel --url http://localhost:3000"

echo.
echo =========================================================
echo  Tudo pronto!
echo  - No seu notebook: http://localhost:3000
echo  - Nos celulares (mesmo Wi-Fi): veja o IP na janela do Backend
echo  - Nos celulares (4G/5G ou Wi-Fi restrito com Camera):
echo    use o link https://....trycloudflare.com da janela do Tunel!
echo =========================================================
pause
