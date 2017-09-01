// @flow

export function throttle(func: (any) => any, wait: number) {
    let time = Date.now();
    return () => {
        if ((time + wait - Date.now()) < 0) {
            func();
            time = Date.now();
        }
    }
}
