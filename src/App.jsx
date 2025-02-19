import * as Papa from "papaparse";
import randomColor from "randomcolor";
import { useEffect, useState } from "react";
import useSWR from "swr";
import tinycolor from "tinycolor2";
import { classes as cx, cssRaw, cssRule, style, stylesheet } from "typestyle";
import coinSvgUrl from "./assets/coin.svg?no-inline";
import crystalSvgUrl from "./assets/crystal.svg?no-inline";
import dataUrl from "./assets/data.csv?url";
import starSvgUrl from "./assets/star.svg?no-inline";
import { starsColor } from "./constants.js";
import Svg from "./Svg.jsx";
import Table from "./Table.jsx";
import { Theme } from "./utils.js";

cssRaw(
    "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Roboto+Mono:wght@600&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');"
);
cssRule("#root", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fbfbfb"
});
const bossImageUrls = import.meta.glob("./assets/boss_images/*.png", { eager: true, import: "default" });
const theme = new Theme();
const iconSize = 50;
const badgeScale = 0.2;
const sx = stylesheet({
    star: {
        height: "0.9lh"
    },
    coin: {
        height: "0.8lh",
        color: "#FFD700",
        marginRight: "5px"
    },
    icon: {
        width: iconSize + "px",
        height: iconSize + "px",
        display: "inline-block",
        backgroundSize: "contain",
        position: "relative",
        verticalAlign: "middle",
        marginInlineEnd: "2px",
        $nest: {
            "&::after": {
                width: "100%",
                height: badgeScale * 100 + "%",
                position: "absolute",
                bottom: "12%",
                fontSize: iconSize * badgeScale * 0.7 + "px",
                textAlign: "right",
                paddingRight: "3px",
                boxSizing: "border-box"
            }
        }
    },
    table: {
        fontFamily: "Noto Sans TC",
        backgroundColor: theme.get("table-background", ["#c3e6ff"]),
        border: "1px inset",
        borderRadius: "10px",
        width: "fit-content",
        gap: "5px 30px",
        padding: "15px",
        height: "500px",
        $nest: {
            "tr": {
                borderRadius: "10px",
                backgroundColor: theme.get("row-background", ["#fffcf4"]),
                color: theme.get("row-text-color", []),
                alignItems: "center",
                paddingInline: "10px",
                borderStyle: "outset",
                borderWidth: "1px 4px 3px 1px"
            },
            "tbody > tr:hover": {
                borderStyle: "inset",
                borderWidth: "3px 1px 1px 2px",
                transition: "border-width 0.1s ease-in"
            },
            "tbody > tr": {
                height: "70px"
            },
            "tbody > tr[data-checked]": {
                borderStyle: "inset",
                borderWidth: "4px 1px 1px 3px",
                backgroundColor: "#ebe6da",
                transition: "none"
            },
            "thead > tr": {
                height: "50px",
                backgroundColor: theme.get("header-background", ["#ffe8a9"]),
                color: theme.get("header-text-color", [])
            },
            "&::after": {
                "@supports ( -moz-appearance:none )": {
                    content: "''",
                    width: "100%",
                    height: "15px"
                }
            }
        }
    },
    textCenter: {
        textAlign: "center"
    },
    crystal: {
        width: "24px",
        verticalAlign: "middle"
    },
    container: {
        margin: "0 auto",
        width: "min-content"
    },
    info: {
        display: "flex",
        justifyContent: "space-around",
        margin: "10px"
    }
});

const badgesStyle = stylesheet({
    "簡易": {
        $nest: {
            "&::after": {
                content: "'EASY'",
                color: "white",
                background: "gray"
            }
        }
    },
    "普通": {
        $nest: {
            "&::after": {
                content: "'NORMAL'",
                color: "white",
                background: "#00ADBD"
            }
        }
    },
    "困難": {
        $nest: {
            "&::after": {
                content: "'HARD'",
                color: "white",
                background: "#BD002F"
            }
        }
    },
    "混沌": {
        $nest: {
            "&::after": {
                content: "'CHAOS'",
                color: "#FCDF77",
                background: "black"
            }
        }
    },
    "終極": {
        $nest: {
            "&::after": {
                content: "'EXTREME'",
                color: "red",
                background: "black"
            }
        }
    }
});

function App() {
    /* useEffect(() => {
        const timer = setInterval(() => {
            const rowBackground = randomColor();
            const headerBackground = randomColor();
            theme.update({
                "table-background": randomColor(),
                "row-background": rowBackground,
                "header-background": headerBackground,
                "row-text-color": tinycolor.mostReadable(rowBackground, ["white", "black"]),
                "header-text-color": tinycolor.mostReadable(headerBackground, ["white", "black"])
            }, `.${sx.table}`);
        }, 3000);
        return () => clearInterval(timer);
    }, [sx.table]); */
    const [selected, setSelected] = useState([]);

    function handleRowClick({ currentTarget: element }) {
        if ("checked" in element.dataset) {
            delete element.dataset.checked;
            setSelected(selected.filter((id) => id !== element.dataset.id));
        } else {
            element.dataset.checked = "";
            setSelected(selected.concat([element.dataset.id]));
        }
    }

    const fetchResult = useSWR(dataUrl, (url) => fetch(url).then((res) => res.text()));
    if (fetchResult.error) {
        return <div>failed to load: {fetchResult.error}</div>;
    }
    if (fetchResult.isLoading) {
        return <div>loading...</div>;
    }
    const parseResult = Papa.parse(fetchResult.data, { header: true, skipEmptyLines: true });
    if (parseResult.error) {
        return <div>failed to parse: {parseResult.error}</div>;
    }

    return (
        <div className={sx.container}>
            <div>
                <Table className={sx.table} numsCols={6}>
                    <thead>
                        <tr>
                            <th>名稱</th>
                            <th>難度</th>
                            <th>楓幣</th>
                            <th>星級</th>
                            <th>等級</th>
                            <th>頻率</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parseResult.data.map(
                            (
                                { "名稱": name, "難度": difficulty, "楓幣": meso, "星級": stars, "等級": level, "頻率": frequency, "血量": hp,
                                    "防禦率": defense, "圖示": icon, "說明": info },
                                index
                            ) => {
                                return (
                                    <tr key={index} data-id={index} onClick={handleRowClick}>
                                        <td>
                                            <div className={cx(sx.icon, badgesStyle[difficulty])}
                                                style={{ backgroundImage: `url(${icon.startsWith("./") ? bossImageUrls[icon] : icon})` }}
                                            >
                                            </div>
                                            {name}
                                        </td>
                                        <td className={sx.textCenter}>{difficulty}</td>
                                        <td>
                                            <Svg href={coinSvgUrl} width="24" height="24"
                                                className={cx(sx.coin, !meso && { visibility: "hidden" })} />
                                            <span>{new Intl.NumberFormat("en-US").format(meso)}</span>
                                        </td>
                                        <td>
                                            {Array.from({ length: starsColor[stars].num },
                                                (_, index) => <Star key={index} style={{ color: starsColor[stars].color }} />)}
                                        </td>
                                        <td className={sx.textCenter}>{level}</td>
                                        <td className={sx.textCenter}>{frequency}</td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </Table>
            </div>
            <Info data={parseResult.data} selected={selected} />
        </div>
    );
}

function Star({ style }) {
    return <Svg className={sx.star} style={style} href={starSvgUrl} width="20" height="20" />;
}

function Info({ data, selected }) {
    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let mesos = 0;
    selected.forEach((id) => {
        const { "名稱": name, "難度": difficulty, "楓幣": meso, "星級": stars, "等級": level, "頻率": frequency, "血量": hp, "防禦率": defense,
            "圖示": icon, "說明": info } = data.at(id);
        mesos += parseInt(meso || 0);
        switch (frequency) {
            case "日":
                daily++;
                break;
            case "週":
                weekly++;
                break;
            case "月":
                monthly++;
                break;
        }
    });

    return (
        <div className={sx.info}>
            <div className={sx.crystalInfo}>
                <span>
                    {daily}
                    <Svg className={sx.crystal} style={{ color: "#11b4fc" }} href={crystalSvgUrl} width="24" height="24" />
                </span>
                +
                <span>
                    {weekly}
                    <Svg className={sx.crystal} style={{ color: "#9f3eff" }} href={crystalSvgUrl} width="24" height="24" />
                </span>
                +
                <span>
                    {monthly}
                    <Svg className={sx.crystal} style={{ color: "#ffcd27" }} href={crystalSvgUrl} width="24" height="24" />
                </span>
                =
                <span>{daily + weekly + monthly}</span>
            </div>
            <div className={sx.mesoInfo}>
                <Svg href={coinSvgUrl} width="24" height="24" className={sx.coin} />
                <span>{new Intl.NumberFormat("en-US").format(mesos)}</span>
            </div>
        </div>
    );
}

export default App;
