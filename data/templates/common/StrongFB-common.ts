
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

export function SFB_error(message?: any, ...optionalParams: any[]) {
    console.log(
        `%cSFB_ERR` + `%c ${message}`,
        "font-size: 11px;color: #fff; background:red;border-radius: 10px;padding: 2px 8px;",
        "",
        optionalParams,
    );
}

export function hashCode(value: string): string {
    let hash = 0, i, chr;
    for (i = 0; i < value.length; i++) {
        chr = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
}
/************************************************* */
export function convertBytesToHumanly(bytes: number, units = ['Bytes', 'KB', 'MB', 'GB', 'TB']) {
    let size = bytes.toString();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < units.length; i++) {
        if (bytes < 1000) { return size + ' ' + units[i]; }
        bytes /= 1000;
        size = bytes.toFixed(1);
    }
    return size + ' ' + units[units.length - 1];
}
/************************************************* */

export function colorIsLight(color: string) {
    color = color.substring(1);      // strip #
    const rgb = parseInt(color, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >> 8) & 0xff;  // extract green
    const b = (rgb >> 0) & 0xff;  // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness >= 128;
}

/************************************************* */
export function convertSecondsToHumanly(seconds: number) {
    let units = ['s', 'm', 'h', 'd', 'w'];
    let i = 0;
    // tslint:disable-next-line: prefer-for-of
    while (true) {
        if (units[i] === 's' || units[i] === 'm') {
            if (seconds < 60) break;
            seconds /= 60;
            i++;
        }
        else if (units[i] === 'h') {
            if (seconds < 24) break;
            seconds /= 24;
            i++;
        } else if (units[i] === 'd') {
            if (seconds < 7) break;
            seconds /= 7;
            i++;
        } else {
            break;
        }
        seconds = Number(seconds.toFixed(1));
        if (i >= units.length) break;
    }
    return { unit: units[i], time: seconds };
}
/************************************************* */
export function lengthInUtf8Bytes(str: string) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}
/************************************************* */
export function generateString(length = 10, includeNumbers = true, includeChars = true) {
    var result = '';
    var characters = '';
    if (includeChars) {
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }
    if (includeNumbers) {
        characters += '0123456789';
    }
    if (!includeChars && !includeNumbers) {
        characters += '-';
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}