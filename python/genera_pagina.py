import os
import re
import unicodedata
import json




def generar_html_comuna(comuna, carpeta_salida="../"):
    # 1. Preparar nombres y rutas

    print(f"COMUNA -- >{comuna}")
    ruta_json = f"../comunas_data/{comuna['nombre_json']}" # Ajusta según tu estructura real
    
    if  os.path.exists(ruta_json):
        print("existe ruta")

    if not os.path.exists(carpeta_salida):
        os.makedirs(carpeta_salida)

    # 2. El String del HTML (Template)
    # Usamos triple comilla y f-string para inyectar las variables
    html_head = f"""
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

        <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon">
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,900" rel="stylesheet">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/font-awesome.min.css">
        <link rel="stylesheet" href="css/style.css?asdsdd">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="css_custom/style_custom.css" />

        <title>resideo.</title>
    </head>
    """;

    body_html1=f"""
    <body>
        <input type="hidden" id="latitud"  value="{comuna['latitud']}">
        <input type="hidden" id="longitud" value="{comuna['longitud']}">
        <input type="hidden" id="comuna" value="{comuna['nombre']}">
        <input type="hidden" id="comuna_json" value="{comuna['nombre_json']}">
    """;


    menu_html=f"""
    <div class="pxp-header pxp-full fixed-top">
        <div class="pxp-container-full">
            <div class="row align-items-center">
                <div class="col-5 col-md-2">
                    <a href="index.html" class="pxp-logo text-decoration-none"><span id="log_html"></span></a>
                </div>
                <div class="col-2 col-md-8 text-center">
                    <ul class="pxp-nav list-inline">
                        <li class="list-inline-item">
                            <a href="#">Inicio</a>
                        </li>
                        <li class="list-inline-item">
                            <a href="#">Bencineras</a>
                            <ul class="pxp-nav-sub rounded-lg">
                                <li><a href="santiago-centro.html">Mapa</a></li>
                                <li><a href="VAR_LISTADO_BENCINERAS.html">Listado</a></li>
                            </ul>
                        </li>
                        <li class="list-inline-item pxp-is-last"><a href="contact.html">Contactanos</a></li>
                    </ul>
                </div>
                <div class="col-5 col-md-2 text-right">
                    <a href="javascript:void(0);" class="pxp-header-nav-trigger"><span class="fa fa-bars"></span></a>
                </div>
            </div>
        </div>
    </div>
    """

   

    listado_bencineras_html =f"""<div class="container"><div class="row">"""
    cantidad_estaciones = 0;
    try:
            # 1. Abrir y cargar el archivo de mapeo
            with open(ruta_json, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"DATA JSON {data}")
            # 2. Obtener la lista de comunas
            lista_estaciones = data.get('estaciones', [])
            cantidad_estaciones = len(lista_estaciones)
            print(f"lista_estaciones {lista_estaciones}")
               
            
            print(f"📂 Leídas {len(lista_estaciones)} estaciones desde {ruta_json}")

            # 3. Invocar la generación para cada una
            for estacion in lista_estaciones:
            
                listado_bencineras_html+=f"""
                
                    <div class="col-sm-12 col-md-6 col-lg-4">
                        <a href="single-agent.html" class="pxp-agents-1-item" data-prop="{estacion['id']}">
                            <div class="pxp-agents-1-item-fig-container rounded-lg">
                                <div class="pxp-agents-1-item-fig pxp-cover" style="
                                        background-image: url({estacion['logo']}); 
                                        background-position: top center;
                                        background-size: 330 330; 
                                        background-repeat: no-repeat;
                                        width: 458px; 
                                        height: 100px;
                                        
                                        "></div>
                            </div>
                            <div class="pxp-agents-1-item-details rounded-lg">
                                <div class="pxp-agents-1-item-details-name">{estacion['nombre_bencinera']}</div>
                                <div class="pxp-agents-1-item-details-name">{estacion['direccion']}</div>
                """

                for combustible in estacion['combustibles']:
                    listado_bencineras_html+=f"""<div class="pxp-agents-1-item-details-email">{combustible['nombre_corto']} <span class="fa fa-dollar"></span>{combustible['precio']} ({combustible['unidad_cobro']} )</div>"""


                listado_bencineras_html+=f"""</div></a></div>"""

            print("\n✨ ¡Proceso de generación masiva completado!")

    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{ruta_json}'. Asegúrate de que el script de Python lo haya generado primero.")
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")

    listado_bencineras_html+=f"""</div></div>"""

    mapa_filtro_html=f"""
        <div class="pxp-content pxp-full-height">

            <!--####################### Seccion 1  #######################-->
            <!--####################### MAPA #######################-->
            <div class="pxp-map-side pxp-map-right pxp-half">
                <div id="results-map"></div>
                <a href="javascript:void(0);" class="pxp-list-toggle"><span class="fa fa-list"></span></a>
            </div>
            <!--####################### MAPA #######################-->
            <!--####################### Seccion 1  #######################-->

            <!--####################### Seccion 2  #######################-->
            <div class="pxp-content-side pxp-content-left pxp-half">
                <div class="pxp-content-side-wrapper">

                    <!--####################### FILTRO #######################-->
                    <div class="d-flex">
                        <div class="pxp-content-side-search-form">
                            <div class="row pxp-content-side-search-form-row">
                                <div class="col-sm-5 col-md-4 col-lg-3 pxp-content-side-search-form-col">
                                    <div class="d-flex justify-content-end align-items-center h-100">
                                        <span class="pxp-bencina-label">Seleccione Ubicación</span>
                                    </div>
                                </div>

                                <div
                                    class="col-sm-7 col-md-8 col-lg-9 pxp-content-side-search-form-col pxp-search-container">

                                    <select class="custom-select" id="pxp-p-search-location">
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="row pb-4">
                        <div class="col-sm-6">
                            <h2 class="pxp-content-side-h2"> {cantidad_estaciones} Resultados</h2>
                        </div>
                        <div class="col-sm-6">
                            <div class="pxp-sort-form form-inline float-right">
                                <div class="form-group">
                                    <select class="custom-select" id="pxp-sort-results">
                                        <option value="" selected="selected">Ordenar mas enconomica</option>
                                        <option value="4-12">Kerosene</option>
                                        <option value="3-11-">Petroleo Diesel</option>
                                        <option value="1-8">Gasolina 93</option>
                                        <option value="7-9">Gasolina 95</option>
                                        <option value="2-10">Gasolina 97</option>
                                        <option value="6">GLP Vehicular</option>
                                        <option value="5">GNC</option>
                                    </select>
                                </div>
                                <div class="form-group d-flex">
                                    <a role="button" class="pxp-map-toggle"><span class="fa fa-map-o"></span></a>
                                </div>
                            </div>
                        </div>
                    </div>
    """

    footer_html=f"""
               <!--####################### LISTADO #######################-->
            </div>
            <div class="pxp-footer pxp-content-side-wrapper">
                <div class="pxp-footer-bottom">
                    <div class="pxp-footer-copyright">&copy; Resideo. All Rights Reserved. 2021</div>
                </div>
            </div>
        </div>
        <!--####################### Seccion 2  #######################-->
    </div>
    """

    end_html=f"""
    
    <script src="js/jquery-3.4.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/main.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="js_custom/map_custom.js"></script>
    <script src="js_custom/select_custom.js"></script>

</body>

</html>
    """
    # 3. Guardar el archivo
    ruta_final = os.path.join(carpeta_salida, comuna['nombre_pagina'])
    with open(ruta_final, "w", encoding="utf-8") as f:
        f.write(html_head)
        f.write(body_html1)
        f.write(menu_html)
        f.write(mapa_filtro_html)
        f.write(listado_bencineras_html)
        f.write(footer_html)
        f.write(end_html)

    print(f"✅ Página generada: {ruta_final}")

# Ejemplo de uso:
if __name__ == "__main__":

    ruta_mapeo = 'mapeo_identificadores.json'
    
    try:
        # 1. Abrir y cargar el archivo de mapeo
        with open(ruta_mapeo, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 2. Obtener la lista de comunas
        lista_comunas = data.get('comunas', [])
        
        print(f"📂 Leídas {len(lista_comunas)} comunas desde {ruta_mapeo}")

        # 3. Invocar la generación para cada una
        for comuna_info in lista_comunas:
            print(f"COMUNA INFO ---> {comuna_info}")
            generar_html_comuna(comuna_info)
            
        print("\n✨ ¡Proceso de generación masiva completado!")

    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{ruta_mapeo}'. Asegúrate de que el script de Python lo haya generado primero.")
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")
