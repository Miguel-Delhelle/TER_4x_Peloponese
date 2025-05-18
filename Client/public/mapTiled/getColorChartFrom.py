import os,sys,json,colorsys
from PIL import Image

def rgb_to_hex(rgb):
  return '#{:02X}{:02X}{:02X}'.format(*rgb)

def rgb_to_hsl(rgb):
  r, g, b = [x / 255.0 for x in rgb]
  h, l, s = colorsys.rgb_to_hls(r, g, b)
  return [round(h * 360), round(s * 100), round(l * 100)]

def average_rgb(rgb_list):
  count = len(rgb_list)
  r = sum(color[0] for color in rgb_list) // count
  g = sum(color[1] for color in rgb_list) // count
  b = sum(color[2] for color in rgb_list) // count
  return [r, g, b]

def average_hsl(hsl_list):
  count = len(hsl_list)
  h = sum(c[0] for c in hsl_list) // count
  s = sum(c[1] for c in hsl_list) // count
  l = sum(c[2] for c in hsl_list) // count
  return [h, s, l]

def extract_grid_colors(filename: str, width: int, height: int, exportname: str = None) -> str:
  image = Image.open(filename).convert('RGB')
  img_width, img_height = image.size
  rows = img_height // height
  cols = img_width // width
  output = []

  for i in range(rows):
    row_data = []
    rgb_list = []
    hsl_list = []

    for j in range(cols):
      cx = j * width + width // 2
      cy = i * height + height // 2
      rgb = image.getpixel((cx, cy))
      hsl = rgb_to_hsl(rgb)
      hex_color = rgb_to_hex(rgb)

      rgb_list.append(rgb)
      hsl_list.append(hsl)

      row_data.append({
        "col": j,
        "HEX": hex_color,
        "RGB": list(rgb),
        "HSL": hsl
      })

    avg_rgb = average_rgb(rgb_list)
    avg_hsl = average_hsl(hsl_list)
    avg_hex = rgb_to_hex(avg_rgb)

    output.append({
      "row": i,
      "name": "",
      "avgHEX": avg_hex,
      "avgRGB": avg_rgb,
      "avgHSL": avg_hsl,
      "data": row_data
    })

  if not exportname:
    base_name = os.path.splitext(os.path.basename(filename))[0]
    exportname = os.path.join(os.getcwd(), base_name + '.json')

  with open(exportname, 'w') as f:
    json.dump(output, f, indent=2)

  return exportname

if len(sys.argv) < 4:
  print(
    f"""Incorrect number of arguments ({len(sys.argv)}/3)!
    \n -> python3 script.py filename width height [exportname]
    \nMakes sure to use the parameters:
    \n  • filename, name of the PNG file
    \n  • width, the width in pixel of a cell
    \n  • height, the height in pixel of a cell
    \n  • exportname?, the name and location of the JSON file (otherwise use your current location 
    and use the name of the PNG file)"""
  )
else:
  print("JSON location: ",extract_grid_colors(sys.argv[1], int(sys.argv[2]), int(sys.argv[3])))