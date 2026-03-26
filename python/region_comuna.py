import json
import requests
import re
import unicodedata
import os

# Configuración
URL_ESTACIONES = 'https://api.bencinaenlinea.cl/api/busqueda_estacion_filtro'
URL_MARCAS = 'https://api.bencinaenlinea.cl/api/marca_ciudadano'
FILE_OUTPUT = 'busqueda_estacion_con_ids.json'
FILE_MAPEO = 'mapeo_identificadores.json'
FOLDER_COMUNAS = '../comunas_data'

def limpiar_texto_url(texto, extension=".html"):
    """Convierte un nombre a formato slug/url"""
    if not texto:
        return ""
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('ascii')
    texto = texto.lower()
    # Reemplazar caracteres no alfanuméricos por guiones
    texto = re.sub(r'[^a-z0-9]+', '-', texto)
    texto = texto.strip('-')
    return f"{texto}{extension}"

def obtener_mapa_marcas():
    """Obtiene las marcas de la API y retorna un diccionario {id: nombre}"""
    try:
        print(f"🏷️ Obteniendo catálogo de marcas...")
        res = requests.get(URL_MARCAS, timeout=20)
        res.raise_for_status()
        marcas_data = res.json().get('data', [])
        return {str(m['id']): m['nombre'] for m in marcas_data}
    except Exception as e:
        print(f"⚠️ No se pudieron obtener las marcas: {e}")
        return {}

def procesar_datos():
    try:
        # 1. Obtener Marcas
        mapa_marcas = obtener_mapa_marcas()

        # 2. Obtener Estaciones
        print(f"🌐 Descargando estaciones...")
        response = requests.get(URL_ESTACIONES, timeout=30)
        response.raise_for_status()
        estaciones = response.json().get('data', [])

        # Diccionarios para almacenar coordenadas de referencia por comuna
        coordenadas_comunas = {}

        # 3. Procesar estaciones y capturar primera coordenada por comuna
        for estacion in estaciones:
            nombre_comuna = estacion.get('comuna')
            id_marca = str(estacion.get('marca', ''))
            
            # Cruce de nombre de bencinera
            estacion['nombre_bencinera'] = mapa_marcas.get(id_marca, "Independiente/Otra")

            # Guardar la lat/lng de la primera estación que encontremos de esta comuna
            if nombre_comuna and nombre_comuna not in coordenadas_comunas:
                coordenadas_comunas[nombre_comuna] = {
                    "latitud": estacion.get('latitud'),
                    "longitud": estacion.get('longitud')
                }

        # 4. Generar archivos JSON individuales
        if not os.path.exists(FOLDER_COMUNAS):
            os.makedirs(FOLDER_COMUNAS)

        comunas_dict = {}
        for est in estaciones:
            com = est.get('comuna')
            if com:
                if com not in comunas_dict: comunas_dict[com] = []
                comunas_dict[com].append(est)

        for nom_comuna, lista in comunas_dict.items():
            ruta = os.path.join(FOLDER_COMUNAS, limpiar_texto_url(nom_comuna, ".json"))
            with open(ruta, 'w', encoding='utf-8') as f:
                json.dump({"comuna": nom_comuna, "estaciones": lista}, f, indent=4, ensure_ascii=False)

        # 5. Crear mapeos de ID
        regiones_unicas = sorted(list(set(e.get('region') for e in estaciones if e.get('region'))))
        comunas_unicas = sorted(list(set(e.get('comuna') for e in estaciones if e.get('comuna'))))

        mapa_id_regiones = {nombre: i + 1 for i, nombre in enumerate(regiones_unicas)}
        mapa_id_comunas = {nombre: i + 1 for i, nombre in enumerate(comunas_unicas)}

        # 6. Generar mapeo_identificadores.json con coordenadas
        mapeo_referencia = {
            "regiones": [
                {"id": v, "nombre": k, "nombre_pagina": limpiar_texto_url(k, ".html")} 
                for k, v in mapa_id_regiones.items()
            ],
            "comunas": [
                {
                    "id": v, 
                    "nombre": k, 
                    "nombre_pagina": limpiar_texto_url(k, ".html"),
                    "nombre_json": limpiar_texto_url(k, ".json"),
                    "latitud": coordenadas_comunas.get(k, {}).get('latitud'), # <--- Nuevo
                    "longitud": coordenadas_comunas.get(k, {}).get('longitud') # <--- Nuevo
                } 
                for k, v in mapa_id_comunas.items()
            ]
        }
        
        with open(FILE_MAPEO, 'w', encoding='utf-8') as f:
            json.dump(mapeo_referencia, f, indent=4, ensure_ascii=False)

        print(f"✅ Archivo {FILE_MAPEO} actualizado con coordenadas de referencia.")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    procesar_datos()