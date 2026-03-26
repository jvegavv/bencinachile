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
FOLDER_COMUNAS = 'comunas_data'

def limpiar_texto_url(texto, extension=".html"):
    """Convierte un nombre a formato slug/url"""
    if not texto:
        return ""
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('ascii')
    texto = texto.lower()
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
        # Creamos un diccionario donde la clave es el ID (como string) y el valor es el nombre
        return {str(m['id']): m['nombre'] for m in marcas_data}
    except Exception as e:
        print(f"⚠️ No se pudieron obtener las marcas: {e}")
        return {}

def generar_archivos_por_comuna(estaciones):
    """Agrupa estaciones por comuna y crea un archivo .json por cada una"""
    if not os.path.exists(FOLDER_COMUNAS):
        os.makedirs(FOLDER_COMUNAS)

    comunas_dict = {}
    for estacion in estaciones:
        nombre_comuna = estacion.get('comuna')
        if nombre_comuna:
            if nombre_comuna not in comunas_dict:
                comunas_dict[nombre_comuna] = []
            comunas_dict[nombre_comuna].append(estacion)

    for nombre_comuna, lista_estaciones in comunas_dict.items():
        nombre_archivo = limpiar_texto_url(nombre_comuna, extension=".json")
        ruta_completa = os.path.join(FOLDER_COMUNAS, nombre_archivo)
        
        with open(ruta_completa, 'w', encoding='utf-8') as f:
            json.dump({"comuna": nombre_comuna, "estaciones": lista_estaciones}, f, indent=4, ensure_ascii=False)

def procesar_datos():
    try:
        # 1. Obtener Mapa de Marcas (Cruce)
        mapa_marcas = obtener_mapa_marcas()

        # 2. Obtener Estaciones
        print(f"🌐 Descargando estaciones...")
        response = requests.get(URL_ESTACIONES, timeout=30)
        response.raise_for_status()
        estaciones = response.json().get('data', [])

        # 3. Realizar el cruce de "marca" -> "nombre_bencinera"
        for estacion in estaciones:
            id_marca = str(estacion.get('marca', ''))
            # Agregamos el nuevo campo buscando en nuestro mapa de marcas
            estacion['nombre_bencinera'] = mapa_marcas.get(id_marca, "Independiente/Otra")

        # 4. Generar archivos individuales por comuna (ya con el nombre_bencinera incluido)
        generar_archivos_por_comuna(estaciones)

        # 5. Crear mapeos de ID para Regiones y Comunas (para los archivos maestros)
        regiones_unicas = sorted(list(set(e.get('region') for e in estaciones if e.get('region'))))
        comunas_unicas = sorted(list(set(e.get('comuna') for e in estaciones if e.get('comuna'))))

        mapa_id_regiones = {nombre: i + 1 for i, nombre in enumerate(regiones_unicas)}
        mapa_id_comunas = {nombre: i + 1 for i, nombre in enumerate(comunas_unicas)}

        # 6. Guardar archivo general con IDs numéricos
        estaciones_con_ids = []
        for est in estaciones:
            nueva = est.copy()
            nueva['region'] = mapa_id_regiones.get(est.get('region'), est.get('region'))
            nueva['comuna'] = mapa_id_comunas.get(est.get('comuna'), est.get('comuna'))
            estaciones_con_ids.append(nueva)

        with open(FILE_OUTPUT, 'w', encoding='utf-8') as f:
            json.dump({"data": estaciones_con_ids}, f, indent=4, ensure_ascii=False)

        # 7. Actualizar mapeo_identificadores.json
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
                    "nombre_json": limpiar_texto_url(k, ".json")
                } 
                for k, v in mapa_id_comunas.items()
            ]
        }
        
        with open(FILE_MAPEO, 'w', encoding='utf-8') as f:
            json.dump(mapeo_referencia, f, indent=4, ensure_ascii=False)

        print(f"✅ Proceso finalizado. Se incluyó 'nombre_bencinera' mediante cruce de APIs.")

    except Exception as e:
        print(f"❌ Error general: {e}")

if __name__ == "__main__":
    procesar_datos()