from svgelements import SVG, Path
from lxml import etree
import sys

def normalize(path_in, path_out, stroke_width=2, pad_frac=0.06):
    svg = SVG.parse(path_in)
    paths_data = []
    xmin=ymin=1e18
    xmax=ymax=-1e18
    for el in svg.elements():
        if isinstance(el, Path):
            el.reify()
            bb = el.bbox()
            if bb:
                x0,y0,x1,y1 = bb
                xmin=min(xmin,x0); xmax=max(xmax,x1)
                ymin=min(ymin,y0); ymax=max(ymax,y1)
            paths_data.append((el.id, el.d(), el.fill))

    w = xmax-xmin
    h = ymax-ymin
    padx = w*pad_frac
    pady = h*pad_frac
    offset_x = xmin - padx
    offset_y = ymin - pady

    def shift_path_d(d, dx, dy):
        p = Path(d)
        p.transform.post_translate(-dx, -dy)
        p.reify()
        return p.d()

    new_paths = []
    for pid, d, fill in paths_data:
        nd = shift_path_d(d, offset_x, offset_y)
        new_paths.append((pid, nd, fill))

    new_w = w + 2*padx
    new_h = h + 2*pady

    def fmt(v):
        return f"{v:.2f}".rstrip('0').rstrip('.')

    nsvg = etree.Element('svg')
    nsvg.set('viewBox', f"0 0 {fmt(new_w)} {fmt(new_h)}")
    nsvg.set('xmlns', 'http://www.w3.org/2000/svg')
    g = etree.SubElement(nsvg, 'g')
    g.set('fill', 'none')
    g.set('stroke', 'currentColor')
    g.set('stroke-width', str(stroke_width))
    g.set('stroke-linecap', 'round')
    g.set('stroke-linejoin', 'round')

    for pid, d, fill in new_paths:
        p = etree.SubElement(g, 'path')
        p.set('d', d)
        if fill is not None:
            fill_str = str(fill)
            if fill_str.lower() not in ('none','transparent') and fill_str != 'None':
                p.set('fill', fill_str)

    out = etree.tostring(nsvg, pretty_print=True, xml_declaration=False).decode()
    with open(path_out,'w') as f:
        f.write(out)
    print(path_out, 'viewBox:', new_w, new_h, 'n_paths:', len(new_paths))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python normalize.py <input_svg> [<output_svg>]")
        sys.exit(1)

    if len(sys.argv) == 2:
        path_in = sys.argv[1]
        path_out = "norm_" + path_in
    else:
        path_in = sys.argv[1]
        path_out = sys.argv[2]

    normalize(path_in, path_out)