import re

file_path = "/Users/jorge.vega/Desktop/todobencina/bencinachile/estacion-servicio/aramco.html"

with open(file_path, "r") as f:
    content = f.read()

# Replace <div class="... pxp-cover ..." style="background-image: url(...); background-position: ...;"></div>
# with <div class="..."><img src="..." class="pxp-cover" style="object-position: ...;" alt="..."></div>

# 1. Add style_custom.css link BEFORE <title>
if "/css_custom/style_custom.css" not in content:
    content = content.replace("<title>", '<link rel="stylesheet" href="/css_custom/style_custom.css?v=2">\n    <title>')

# 2. Main agent photo replacement
# Find: <div class="pxp-agent-photo pxp-cover rounded-lg mt-4 mt-md-5 mt-lg-0" style="background-image: url(/images/estacion_servicio_aramco.png); background-position: 50% 0%;"></div>
pattern_main = re.compile(
    r'<div\s+class="([^"]*pxp-agent-photo[^"]*)"\s+style="background-image:\s*url\(([^)]+)\);\s*background-position:\s*([^;]+);"\s*>\s*</div>',
    re.IGNORECASE | re.DOTALL
)

def replace_main(match):
    classes = match.group(1).replace('pxp-cover', '').replace('  ', ' ').strip()
    image_url = match.group(2).strip()
    bg_pos = match.group(3).strip()
    alt_text = "Estación de servicio"
    if "aramco" in image_url.lower(): alt_text = "Aramco"
    elif "copec" in image_url.lower(): alt_text = "Copec"
    elif "shell" in image_url.lower(): alt_text = "Shell"
    
    return f'<div class="{classes}">\n                            <img src="{image_url}" alt="{alt_text}" class="pxp-cover" style="object-position: {bg_pos};">\n                        </div>'

content = pattern_main.sub(replace_main, content)

# 3. Carousel item replacement
# Find: <div class="pxp-prop-card-1-fig pxp-cover" style="background-image: url(/images/estacion_servicio_shell.png);"></div>
pattern_carousel = re.compile(
    r'<div\s+class="([^"]*pxp-prop-card-1-fig[^"]*)"\s+style="background-image:\s*url\(([^)]+)\);"\s*>\s*</div>',
    re.IGNORECASE | re.DOTALL
)

def replace_carousel(match):
    classes = match.group(1).replace('pxp-cover', '').replace('  ', ' ').strip()
    image_url = match.group(2).strip()
    alt_text = "Estación de servicio"
    if "aramco" in image_url.lower(): alt_text = "Aramco"
    elif "copec" in image_url.lower(): alt_text = "Copec"
    elif "shell" in image_url.lower(): alt_text = "Shell"
    elif "independiente" in image_url.lower(): alt_text = "Independientes"
    
    return f'<div class="{classes}">\n                                <img src="{image_url}" alt="{alt_text}" class="pxp-cover">\n                            </div>'

content = pattern_carousel.sub(replace_carousel, content)

with open(file_path, "w") as f:
    f.write(content)

print("Done")
