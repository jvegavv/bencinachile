#!/bin/bash

# Navegar a la carpeta del repositorio Git
cd "$(dirname "$0")/bencinachile"

echo "📍 Procesando rama feature/ia_help..."
git add .
git commit -m "cambios sh"
git push origin feature/ia_help

echo "📍 Haciendo merge a develop..."
git checkout develop
git merge feature/ia_help
git push origin develop

echo "📍 Haciendo merge a master..."
git checkout master
git merge develop
git push origin master

echo "✅ Proceso completado."
