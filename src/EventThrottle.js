// @flow

export function throttle(func: Function, wait: number): Function {
    let time = Date.now();
    return () => {
        if ((time + wait - Date.now()) < 0) {
            func();
            time = Date.now();
        }
    }
}

export function debounce(func: Function, wait: number): Function {
    let timeoutId;
    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func();
            timeoutId = null;
        }, wait);
    }
}
