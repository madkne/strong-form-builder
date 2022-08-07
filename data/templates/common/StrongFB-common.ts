
export function SFB_warn(message?: any, ...optionalParams: any[]) {
    console.log(
        `%cSFB_WARN` + `%c ${message}`,
        "font-size: 11px;color: #fff; background:#ebe157;border-radius: 10px;padding: 2px 8px;",
        "",
        optionalParams,
    );
}

export function SFB_info(message?: any, ...optionalParams: any[]) {
    console.log(
        `%cSFB_INFO` + `%c ${message}`,
        "font-size: 11px;color: #fff; background:blue;border-radius: 10px;padding: 2px 8px;",
        "",
        optionalParams,
    );
}