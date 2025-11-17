#!/bin/bash

# Script de Verificación Pre-Producción
# Sistema de Votación Electrónica - Proyecto ML

echo "🔍 Verificación Pre-Producción"
echo "================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Verificar Git
echo "📦 Verificando Git..."
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✓${NC} Working tree limpio"
else
    echo -e "${RED}✗${NC} Hay cambios sin commitear"
    ERRORS=$((ERRORS + 1))
fi

# 2. Verificar conflictos de merge
echo "🔀 Verificando conflictos de merge..."
if grep -r "<<<<<<< HEAD" frontend/src/ 2>/dev/null; then
    echo -e "${RED}✗${NC} Se encontraron marcadores de conflicto"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓${NC} Sin conflictos de merge"
fi

# 3. Verificar node_modules
echo "📚 Verificando dependencias..."
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"
else
    echo -e "${YELLOW}⚠${NC} node_modules no encontrado (ejecutar: npm install)"
    WARNINGS=$((WARNINGS + 1))
fi

# 4. Verificar package.json
echo "📄 Verificando package.json..."
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json existe"
else
    echo -e "${RED}✗${NC} package.json no encontrado"
    ERRORS=$((ERRORS + 1))
fi

# 5. Verificar archivos críticos
echo "📁 Verificando archivos críticos..."
CRITICAL_FILES=(
    "frontend/src/App.jsx"
    "frontend/src/components/VoterVerification.jsx"
    "frontend/src/components/ElectionSelection.jsx"
    "frontend/src/main.jsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file no encontrado"
        ERRORS=$((ERRORS + 1))
    fi
done

# 6. Verificar build (si existe)
echo "🏗️  Verificando build..."
if [ -d "frontend/dist" ]; then
    echo -e "${GREEN}✓${NC} Build encontrado"
else
    echo -e "${YELLOW}⚠${NC} Build no encontrado (ejecutar: npm run build)"
    WARNINGS=$((WARNINGS + 1))
fi

# Resumen
echo ""
echo "================================"
echo "📊 Resumen de Verificación"
echo "================================"
echo -e "Errores: ${RED}$ERRORS${NC}"
echo -e "Advertencias: ${YELLOW}$WARNINGS${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}✅ Proyecto listo para producción${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Se encontraron errores. Por favor, corrígelos antes de continuar.${NC}"
    exit 1
fi

