import fitz  # PyMuPDF
import os
import io
import json
from PIL import Image

def inspect_pdf(pdf_path, output_dir, log_file):
    log_file.write(f"\n=========================================\nInspecting: {pdf_path}\n=========================================\n")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        log_file.write(f"Failed to open {pdf_path}: {e}\n")
        return
        
    os.makedirs(output_dir, exist_ok=True)
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text()
        log_file.write(f"\n--- Page {page_num + 1} ---\n")
        first_lines = [line.strip() for line in text.split("\n") if line.strip()][:15]
        log_file.write("Lines: " + " | ".join(first_lines) + "\n")
        
        # Extract images
        image_list = page.get_images(full=True)
        if image_list:
            log_file.write(f"Found {len(image_list)} images on Page {page_num + 1}\n")
            for img_idx, img in enumerate(image_list):
                xref = img[0]
                try:
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    image = Image.open(io.BytesIO(image_bytes))
                    img_name = f"page_{page_num + 1}_img_{img_idx + 1}.{image_ext}"
                    img_path = os.path.join(output_dir, img_name)
                    image.save(img_path)
                    log_file.write(f"  Saved image: {img_name}\n")
                except Exception as e:
                    log_file.write(f"  Error saving image {img_idx + 1} on page {page_num + 1}: {e}\n")

if __name__ == "__main__":
    with open("pdf_inspection_utf8.txt", "w", encoding="utf-8") as f:
        inspect_pdf("MAGSJAM 23-24.pdf", "extracted_magsjam", f)
        inspect_pdf("YRC_magazine_24-25_ECHOES-OF-YOUTH.pdf", "extracted_yrc_magazine", f)
    print("Done inspecting and extracting.")
