import { customAlphabet } from "nanoid/non-secure";

class Theme {
    prefix;
    context = {};
    static hash = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);

    constructor(prefix) {
        this.prefix = prefix ? `--${prefix}-` : "--";
    }

    get(name, fallbacks = null) {
        const varName = this.context[name] ??= `${this.prefix}${name}_${Theme.hash()}`;
        if (Array.isArray(fallbacks)) {
            return `var(${[varName, ...fallbacks].join(", ")})`;
        } else {
            return varName;
        }
    }

    setValue(name, value, priority = "", selector = ":root") {
        const varName = this.get(name);
        document.querySelector(selector).style.setProperty(varName, value, priority);
    }

    update(valueMap, selector = ":root") {
        const element = document.querySelector(selector);
        for (const name in valueMap) {
            let value, priority;
            if (typeof valueMap[name] === "array") {
                [value, priority = ""] = valueMap[name];
            } else {
                value = valueMap[name];
                priority = "";
            }
            const varName = this.get(name);
            element.style.setProperty(varName, value, priority);
        }
    }

    getValue(name, selector = ":root") {
        return getComputedStyle(document.querySelector(selector)).getPropertyValue(this.get(name));
    }

    forgot(name) {
        delete this.context[name];
    }
}

export { Theme };
