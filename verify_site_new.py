import os
import re

def audit_file(filepath, base_dir="."):
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filepath}")
        return 1, []

    errors = 0
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find links: href="..." and src="..."
    hrefs = re.findall(r'href="([^"]+)"', content)
    srcs = re.findall(r'src="([^"]+)"', content)

    # Resolve links relative to file's directory
    file_dir = os.path.dirname(filepath)

    # Exclude external links (http, mailto, tel, absolute)
    def is_local(link):
        if link.startswith("http://") or link.startswith("https://"):
            return False
        if link.startswith("mailto:") or link.startswith("tel:"):
            return False
        if link.startswith("#"):
            return False
        return True

    print(f"Auditing local references in: {filepath}")
    
    # Audit HREFs
    for link in hrefs:
        if is_local(link):
            # Clean anchor hashes
            clean_link = link.split("#")[0]
            if not clean_link:
                continue
            
            # Resolve relative path
            target_path = os.path.normpath(os.path.join(file_dir, clean_link))
            if not os.path.exists(target_path):
                print(f"  [ERROR] Broken link: href=\"{link}\" (Resolved: {target_path})")
                errors += 1
            else:
                # print(f"  [OK] Link: {link}")
                pass

    # Audit SRCs
    for link in srcs:
        if is_local(link):
            target_path = os.path.normpath(os.path.join(file_dir, link))
            if not os.path.exists(target_path):
                print(f"  [ERROR] Broken resource: src=\"{link}\" (Resolved: {target_path})")
                errors += 1
            else:
                # print(f"  [OK] Resource: {link}")
                pass

    return errors

def main():
    print("=== STARTING COMPREHENSIVE LINK AND ASSET AUDIT ===")
    total_errors = 0

    # 1. Audit core HTML pages
    core_pages = ["index.html", "events.html", "team.html", "magazines.html"]
    for page in core_pages:
        errors = audit_file(page)
        total_errors += errors
        print(f"-> {page} check finished with {errors} errors.\n")

    # 2. Audit generated event subpages
    print("Scanning events directory for generated subpages...")
    event_html_files = []
    for root, dirs, files in os.walk("events"):
        for file in files:
            if file.endswith(".html"):
                event_html_files.append(os.path.join(root, file))

    print(f"Found {len(event_html_files)} generated event subpages.")
    event_errors = 0
    for event_page in event_html_files:
        errors = audit_file(event_page)
        event_errors += errors

    total_errors += event_errors
    print(f"-> Event pages check finished with {event_errors} errors.\n")

    print("=== AUDIT SUMMARY ===")
    if total_errors == 0:
        print("SUCCESS: All links, pages, and assets are valid and intact!")
    else:
        print(f"FAILED: Found {total_errors} broken links/assets. Please fix them.")

if __name__ == "__main__":
    main()
