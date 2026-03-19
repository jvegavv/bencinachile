import json
import requests
import re
import unicodedata

# Configuración
URL_API = 'https://api.bencinaenlinea.cl/api/busqueda_estacion_filtro'
FILE_OUTPUT = 'busqueda_estacion_con_ids.json'
FILE_MAPEO = 'mapeo_identificadores.json'

def limpiar_texto_url(texto):
    """Convierte un nombre a formato slug/url y le añade .html"""
    if not texto:
        return ""
    # Normalizar para eliminar tildes
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('ascii')
    texto = texto.lower()
    # Reemplazar caracteres no alfanuméricos por guiones
    texto = re.sub(r'[^a-z0-9]+', '-', texto)
    texto = texto.strip('-')
    
    # Retornar con la extensión .html
    return f"{texto}.html"

def procesar_datos_desde_url():
    try:
        print(f"🌐 Descargando datos desde la API...")
        response = requests.get(URL_API, timeout=30)
        response.raise_for_status()
        
        datos_originales = response.json()
        estaciones = datos_originales.get('data', [])

        # 2. Crear mapeos
        regiones_unicas = sorted(list(set(e.get('region') for e in estaciones if e.get('region'))))
        comunas_unicas = sorted(list(set(e.get('comuna') for e in estaciones if e.get('comuna'))))

        mapa_regiones = {nombre: i + 1 for i, nombre in enumerate(regiones_unicas)}
        mapa_comunas = {nombre: i + 1 for i, nombre in enumerate(comunas_unicas)}

        # 3. Guardar archivo con IDs (este no cambia su lógica de reemplazo)
        nuevas_estaciones = []
        for estacion in estaciones:
            nueva = estacion.copy()
            nueva['region'] = mapa_regiones.get(estacion.get('region'), estacion.get('region'))
            nueva['comuna'] = mapa_comunas.get(estacion.get('comuna'), estacion.get('comuna'))
            nuevas_estaciones.append(nueva)

        with open(FILE_OUTPUT, 'w', encoding='utf-8') as f:
            json.dump({"data": nuevas_estaciones}, f, indent=4, ensure_ascii=False)

        # 4. Generar Mapeo con el nuevo formato de nombre_pagina
        mapeo_referencia = {
            "regiones": [
                {
                    "id": v, 
                    "nombre": k, 
                    "nombre_pagina": limpiar_texto_url(k)
                } for k, v in mapa_regiones.items()
            ],
            "comunas": [
                {
                    "id": v, 
                    "nombre": k, 
                    "nombre_pagina": limpiar_texto_url(k)
                } for k, v in mapa_comunas.items()
            ]
        }
        
        with open(FILE_MAPEO, 'w', encoding='utf-8') as f:
            json.dump(mapeo_referencia, f, indent=4, ensure_ascii=False)

        print(f"✅ Archivos generados. Ejemplo de nombre_pagina: {mapeo_referencia['comunas'][0]['nombre_pagina']}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    procesar_datos_desde_url()