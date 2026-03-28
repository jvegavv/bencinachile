import os
import re
import unicodedata
import json




def generar_html_comuna(comuna, carpeta_salida="../"):
    # 1. Preparar nombres y rutas
    

    ruta_json = f"../comunas_data/{comuna['nombre_json']}" # Ajusta según tu estructura real
    
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
        <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />

        <title>TodoBencina.</title>
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
                    <a href="index.html" class="pxp-logo text-decoration-none">TodoBencina</a>
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
            

            # 2. Obtener la lista de comunas
            lista_estaciones = data.get('estaciones', [])
            cantidad_estaciones = len(lista_estaciones)

               
            
            print(f"📂 Leídas {len(lista_estaciones)} estaciones desde {ruta_json}")

            # 3. Invocar la generación para cada una
            for estacion in lista_estaciones:

                campos_hidden_precio =""
                print(f"---------------------------------------" )
                print(f"---------------------------------------" )
                print(f"📂 Revisando estacion {estacion['id']}" )

                for combustible in estacion['combustibles']:

                    precio_combustible = "-"
                    
                    if (combustible['precio'] != None):
                        precio_combustible = int(float(combustible['precio']))

                    print(f"Precio Combustible {combustible['nombre_corto']} $ {precio_combustible}")

                    campos_hidden_precio+=f""" <input type="hidden" id="{combustible['nombre_corto']}"  value="{precio_combustible}">"""
                 

                listado_bencineras_html+=f"""
                
                    <div class="col-sm-12 col-md-6 col-lg-4 estacion-item">
                        {campos_hidden_precio}
                        <a href="#" class="pxp-agents-1-item" data-prop="{estacion['id']}">
                            <div class="pxp-agents-1-item-fig-container rounded-lg">
                                <div class="pxp-agents-1-item-fig pxp-cover" style="
                                        background-image: url({estacion['logo']}); 
                                        background-position: top center;
                                        background-size: 200px 100px; 
                                        background-repeat: no-repeat;    
                                        "></div>
                            </div>
                            <div class="pxp-agents-1-item-details rounded-lg">
                                <div class="pxp-agents-1-item-details-name">{estacion['nombre_bencinera']}</div>
                                <div class="pxp-agents-1-item-details-name">{estacion['direccion']}</div>
                """

                valor_93 ="" #1
                valor_95 ="" #7
                valor_97 ="" #2
                valor_DI ="" #3
                valor_KE ="" #4
                valor_GNC ="" #5
                valor_GLP ="" #6
                valor_A93 ="" #8
                valor_A95 ="" #9
                valor_A97 ="" #10
                valor_ADI ="" #11
                valor_AKE ="" #12

                for combustible in estacion['combustibles']:

            
                    precio_combustible = "-"
                    html_temp = ""
                    
                    if (combustible['precio'] != None):
                        precio_combustible = int(float(combustible['precio']))


                    if (precio_combustible == "-"):
                        html_temp=f"""<div class="pxp-agents-1-item-details-email combustible_{combustible['nombre_corto']}">{combustible['nombre_corto']} <span class="fa fa-dollar"></span> No Informado </div>"""
                    else:
                        html_temp=f"""<div class="pxp-agents-1-item-details-email combustible_{combustible['nombre_corto']}">{combustible['nombre_corto']} <span class="fa fa-dollar"></span>{f"{precio_combustible:,}".replace(",", ".")} ({combustible['unidad_cobro']} )</div>"""

                    if (combustible['id'] == 1):
                         valor_93 = html_temp 
                    elif (combustible['id'] == 7):
                        valor_95 = html_temp 
                    elif (combustible['id'] == 2):
                        valor_97 = html_temp 
                    elif (combustible['id'] == 3):
                        valor_DI = html_temp 
                    elif (combustible['id'] == 4):
                        valor_KE = html_temp 
                    elif (combustible['id'] == 5):
                        valor_GNC = html_temp 
                    elif (combustible['id'] == 6):
                        valor_GLP = html_temp 
                    elif (combustible['id'] == 8):
                        valor_A93 = html_temp 
                    elif (combustible['id'] == 9):
                        valor_A95 = html_temp 
                    elif (combustible['id'] == 10):
                        valor_A97 = html_temp 
                    elif (combustible['id'] == 11):
                        valor_ADI = html_temp 
                    elif (combustible['id'] == 12):
                        valor_AKE = html_temp 

                if (valor_93 != ""):
                    listado_bencineras_html += valor_93
                
                if (valor_A93 != ""):
                    listado_bencineras_html += valor_A93

                if (valor_95 != ""):
                    listado_bencineras_html += valor_95

                if (valor_A95 != ""):
                    listado_bencineras_html += valor_A95

                if (valor_97 != ""):
                    listado_bencineras_html += valor_97

                if (valor_A97 != ""):
                    listado_bencineras_html += valor_A97

                if (valor_DI != ""):
                    listado_bencineras_html += valor_DI

                if (valor_ADI != ""):
                    listado_bencineras_html += valor_ADI

                if (valor_KE != ""):
                    listado_bencineras_html += valor_KE

                if (valor_AKE != ""):
                    listado_bencineras_html += valor_AKE

                if (valor_GNC != ""):
                    listado_bencineras_html += valor_GNC

                if (valor_GLP != ""):
                    listado_bencineras_html += valor_GLP

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
                            <h2 class="pxp-content-side-h2"> {cantidad_estaciones} Resultados en {comuna['nombre']}</h2>
                        </div>
                        <div class="col-sm-6">
                            <div class="pxp-sort-form form-inline float-right">
                                <div class="form-group">
                                    <select class="custom-select" id="pxp-sort-results">
                                        <option value="" selected="selected">Ordenar mas enconomica</option>
                                        <option value="4-12">Kerosene</option>
                                        <option value="3-11">Petroleo Diesel</option>
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
                    <div class="pxp-footer-copyright">&copy; TodoBencina. All Rights Reserved. 2021</div>
                </div>
            </div>
        </div>
        <!--####################### Seccion 2  #######################-->
    </div>
    """

    modal_html = f"""
        <div class="modal fade" id="gpsModal" tabindex="-1" role="dialog" aria-labelledby="gpsModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-center pt-0">
              <div class="mb-3 d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style="width: 80px; height: 80px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#6c757d" viewBox="0 0 16 16">
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
              </div>
              
              <h5 class="modal-title font-weight-bold mb-2" id="gpsModalLabel">GPS Desactivado</h5>
              <p class="text-muted px-3">Para mostrarte las bencineras cercanas en la región, necesitamos acceder a tu ubicación. Por favor, actívala en tu navegador.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center pb-4">
              <button type="button" class="btn btn-dark px-4 shadow-sm" data-dismiss="modal">Entendido</button>
            </div>
          </div>
        </div>
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
    <script src="js_custom/orderby.js"></script>
    <script src="js_custom/tamano_pagina.js"></script>
    <script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js'></script>
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
        f.write(modal_html)
        f.write(end_html)

    print(f"✅ Página generada: {ruta_final}")

# Ejemplo de uso:
if __name__ == "__main__":

    cont_errores=0;
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
           
            #if (comuna_info["nombre"] == "Santiago Centro"):
                generar_html_comuna(comuna_info)
            
        print("\n✨ ¡Proceso de generación masiva completado!")

    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{ruta_mapeo}'. Asegúrate de que el script de Python lo haya generado primero.")
        cont_errores = 1;
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")
        cont_errores = 1;

    print(f"❌ Error: ERRORES '{cont_errores}'.")
