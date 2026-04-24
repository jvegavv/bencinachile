import os
import re

files_to_modify = [
    "bencina_95_octanos.html",
    "bencina_97_octanos.html",
    "gas_liquado_petroleo_glp.html",
    "gas_natural_comprimido_gnc.html",
    "kerosene_parafina.html",
    "petroleo_diesel.html"
]

base_dir = "/Users/jorge.vega/Desktop/todobencina/bencinachile/combustible"

favicon_block = """    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/images/favicon-48x48.png">
    <link rel="shortcut icon" href="/images/favicon-32x32.png">"""

for fname in files_to_modify:
    fpath = os.path.join(base_dir, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Favicon replacement
    old_favicon = r'<link rel="shortcut icon" href="/images/favicon_todobencina.png" type="image/x-icon">'
    content = content.replace(old_favicon, favicon_block)

    # Extract Data for SEO tags
    url = f"https://todobencina.cl/combustible/{fname}"
    
    title_match = re.search(r'<title>(.*?)</title>', content)
    title = title_match.group(1).strip() if title_match else "TodoBencina"
    fuel_name = title.replace(" - TodoBencina", "").strip()

    img_match = re.search(r'<div class="pxp-agent-photo.*?style="background-image:\s*url\((.*?)\)', content)
    main_image_url = f"https://todobencina.cl{img_match.group(1)}" if img_match else "https://todobencina.cl/images/og-image.png"

    h1_p_match = re.search(r'<h1 class="pxp-page-header float-left">.*?</h1>\s*(?:<div class="clearfix"></div>\s*)?<p>(.*?)</p>', content, re.DOTALL)
    offer_desc = h1_p_match.group(1).strip() if h1_p_match else ""
    
    meta_desc = f"Informate sobre la {fuel_name} en Chile: ¿Que es? | Ventajas principales | aqui en TodoBencina"
    
    ficha_match = re.search(r'<h3>Ficha Técnica</h3>\s*<ul[^>]*>(.*?)</ul>', content, re.DOTALL)
    additional_properties = []
    if ficha_match:
        li_items = re.findall(r'<li><b>(.*?):?\s*</b>\s*(.*?)</li>', ficha_match.group(1))
        for key, val in li_items:
            key = key.strip().replace(":", "")
            val = val.strip()
            val = re.sub(r'<[^>]+>', '', val).strip()
            additional_properties.append({
                "@type": "PropertyValue",
                "name": key,
                "value": val
            })

    import json
    json_ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": fuel_name,
        "image": main_image_url,
        "description": meta_desc,
        "brand": {
            "@type": "Brand",
            "name": "TodoBencina"
        },
        "offers": {
            "@type": "Offer",
            "description": offer_desc,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        }
    }
    if additional_properties:
        json_ld["additionalProperty"] = additional_properties
        
    json_ld_str = json.dumps(json_ld, indent=2, ensure_ascii=False)
    
    seo_block = f"""    <link rel="canonical" href="{url}">
    <meta name="description"
        content="{meta_desc}">


    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{title}">
    <meta property="og:description"
        content="{meta_desc}.">
    <meta property="og:image" content="https://todobencina.cl/images/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="TodoBencina">
    <meta property="og:locale" content="es_CL">

    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{url}">
    <meta property="twitter:title" content="{title}">
    <meta property="twitter:description"
        content="{meta_desc}.">
    <meta property="twitter:image" content="https://todobencina.cl/images/og-image.png">



    <script type="application/ld+json">
{json_ld_str}
</script>

"""
    # Only inject if canonical isn't there already
    if '<link rel="canonical"' not in content:
        content = re.sub(r'\s*</head>', f"\n{seo_block}</head>", content)

    # 3. Rename <h3>Ventajas Principales</h3> to <h2>Ventajas Principales</h2>
    content = content.replace("<h3>Ventajas Principales</h3>", "<h2>Ventajas Principales</h2>")

    # 4. Replace <div> background-image with structural <img>
    def repl_main_photo(match):
        # We find: classes, url, style params
        classes = match.group(1)
        classes = classes.replace(' pxp-cover', '').replace('pxp-cover ', '').replace('pxp-cover', '').strip()
        img_url = match.group(2)
        style = match.group(3) if match.group(3) else ""
        style = style.replace('background-position', 'object-position')
        alt_text = fuel_name
        return f'<div class="{classes}">\n                            <img src="{img_url}" alt="{alt_text}" class="pxp-cover" style="{style}">\n                        </div>'

    content = re.sub(
        r'<div class="(pxp-agent-photo.*?pxp-cover.*?)"\s*style="background-image:\s*url\((.*?)\);?\s*([^"]*)"></div>',
        repl_main_photo,
        content
    )
    
    def repl_carousel_img(match):
        classes = match.group(1).replace(' pxp-cover', '').replace('pxp-cover ', '').replace('pxp-cover', '').strip()
        img_url = match.group(2)
        return f'<div class="{classes}">\n                            <img src="{img_url}" alt="Combustible" class="pxp-cover">\n                        </div>'
        
    content = re.sub(
        r'<div class="(pxp-prop-card-1-fig.*?pxp-cover.*?)"\s*style="background-image:\s*url\((.*?)\);?.*?"></div>',
        repl_carousel_img,
        content
    )

    # 5. Wrap <div class="pxp-prop-card-1-details-price"> text in <h3>
    def repl_price_h3(match):
        text = match.group(1).strip()
        if not text.startswith("<h3>"):
            return f'<div class="pxp-prop-card-1-details-price">\n                                <h3>{text}</h3>\n                            </div>'
        return match.group(0)

    content = re.sub(r'<div class="pxp-prop-card-1-details-price">\s*(.*?)\s*</div>', repl_price_h3, content, flags=re.DOTALL)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
