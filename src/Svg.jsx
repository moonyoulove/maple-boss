function SVG({ href, width, height, x = 0, y = 0, className, style }) {
    return (
        <svg className={className} style={style} viewBox={[x, y, width, height].join(" ")}>
            <use href={href + "#main"}></use>
        </svg>
    );
}

export default SVG;
