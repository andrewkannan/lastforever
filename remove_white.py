from PIL import Image

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

remove_white("public/floral-timeline.png", "public/floral-timeline.png")
remove_white("public/floral-future.png", "public/floral-future.png")
print("Done")
