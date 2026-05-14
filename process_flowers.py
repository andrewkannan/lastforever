from PIL import Image
import os
import glob

def remove_white(image_path, out_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            avg = (item[0] + item[1] + item[2]) / 3
            if avg > 250:
                new_data.append((item[0], item[1], item[2], 0))
            else:
                alpha = max(0, int(255 - ((avg - 235) * (255 / 15))))
                new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(out_path, "PNG")

files = glob.glob("public/flowers/*.png")
for file in files:
    print(f"Processing {file}...")
    remove_white(file, file)
print("Done processing all flowers!")
