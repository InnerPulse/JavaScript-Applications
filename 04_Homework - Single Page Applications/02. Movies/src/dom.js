export function e(type, txt, className, attributes, event) {
    const element = document.createElement(type);
    if (txt) {
        element.textContent = txt;
    }
    if (className) {
        element.className = className;
    }
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    }
    if (event) {
        element.addEventListener('click', event);
    }
    return element;
}

export function build(main, ...rest) {
    main.append(...rest);
    return main;
}
