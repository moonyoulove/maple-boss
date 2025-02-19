import { classes as cx, style } from "typestyle";

const tableStyle = style({
    display: "grid",
    position: "relative",
    overflow: "auto",
    $nest: {
        "thead, tbody": {
            display: "contents"
        },
        "thead > tr": {
            position: "sticky",
            top: "0",
            zIndex: "1"
        },
        "tbody > tr": {},
        "tr": {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridColumn: "1 / -1"
        }
    }
});

function Table({ className, style, children, numsCols }) {
    return (
        <table className={cx(tableStyle, className)} style={{ ...style, gridTemplateColumns: `repeat(${numsCols}, max-content)` }}>
            {children}
        </table>
    );
}

export default Table;
