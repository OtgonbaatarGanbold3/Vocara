# Install a quick CLI tool to generate placeholder PNGs
# Or just create minimal valid PNGs using Python (built into macOS):

python3 -c "
import struct, zlib

def create_png(size, filename):
    # Create a simple colored square PNG
    def chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    # Purple/blue gradient-ish color for Vocara brand
    raw = b''
    for y in range(size):
        raw += b'\x00'  # filter byte
        for x in range(size):
            r, g, b, a = 99, 102, 241, 255  # Indigo color
            raw += struct.pack('BBBB', r, g, b, a)

    header = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', header)
    png += chunk(b'IDAT', zlib.compress(raw))
    png += chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png)

create_png(16, 'public/icons/icon16.png')
create_png(48, 'public/icons/icon48.png')
create_png(128, 'public/icons/icon128.png')
print('✅ Created icon16.png, icon48.png, icon128.png')
"