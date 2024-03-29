import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";

export type TransmitChannelName = 'notification' | 'snackbar-message' | 'page' | 'response' | 'page-loading' | 'screen-mode' | 'dialog-response' | 'dialog-action-click' | 'form-loading';

export enum APIStatusCodes {
    HTTP_100_CONTINUE = 100,
    HTTP_101_SWITCHING_PROTOCOLS = 101,
    HTTP_102_PROCESSING = 102,

    HTTP_200_OK = 200,
    HTTP_201_CREATED = 201,
    HTTP_202_ACCEPTED = 202,

    HTTP_301_MOVED_PERMANENTLY = 301,
    HTTP_302_MOVED_TEMPORARILY = 302,
    HTTP_303_SEE_OTHER = 303,
    HTTP_304_NOT_MODIFIED = 304,
    HTTP_305_USE_PROXY = 305,
    HTTP_306_SWITCH_PROXY = 306,
    HTTP_307_TEMPORARY_REDIRECT = 307,
    HTTP_308_PERMANENT_REDIRECT = 308,

    HTTP_400_BAD_REQUEST = 400,
    HTTP_401_UNAUTHORIZED = 401,
    HTTP_403_FORBIDDEN = 403,
    HTTP_404_NOT_FOUND = 404,
    HTTP_405_METHOD_NOT_ALLOWED = 405,
    HTTP_406_NOT_ACCEPTABLE = 406,
    HTTP_408_REQUEST_TIMEOUT = 408,
    HTTP_409_CONFLICT = 409,
    HTTP_429_TOO_MANY_REQUESTS = 429,

    HTTP_500_INTERNAL_SERVER_ERROR = 500,
    HTTP_501_NOT_IMPLEMENTED = 501,
    HTTP_502_BAD_GATEWAY = 502,
    HTTP_503_SERVICE_UNAVAILABLE = 503,
    HTTP_504_GATEWAY_TIMEOUT = 504,
    HTTP_505_HTTP_VERSION_NOT_SUPPORTED = 505,
}

export type ScreenMode = 'desktop' | 'tablet' | 'mobile';

export type NotifyMode = 'success' | 'failure' | 'info' | 'warning';

export type StrongFBValidatorName = 'required' | 'maxLength' | 'minLength' | 'acceptPattern' | 'rejectPattern' | 'email' | 'min' | 'max' | 'number' | 'custom';

export type AvailableLanguage = 'fa' | 'en';

export type Direction = 'rtl' | 'ltr';

export type LocaleCalendar = 'jalali' | 'gregorian' | 'auto';

export type LocaleNamespace = 'units' | 'common' | 'info' | 'msgs';

export type CustomLocales = { [k in AvailableLanguage]?: { [k1: string]: { [k2: string]: string } } };


export type NotifyCssAnimationStyle = 'fade' | 'zoom' | 'from-right' | 'from-top' | 'from-bottom' | 'from-left';

export type StrongFBWidgetShowCallback = (self?: StrongFBBaseWidgetHeader) => Promise<boolean> | boolean;

export type ButtonStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export type ButtonAppearance = 'fill' | 'outline' | 'colorful' | 'basic';

export type BlockLoadingType = 'circle' | 'standard' | 'hourglass' | 'arrows' | 'dots' | 'pulse';

export type HttpMethodName = 'GET' | 'POST' | 'PUT' | 'DELETE';
/**************************** */
/*********CONSTANTS********** */
/**************************** */

export const AvailableLanguages: AvailableLanguage[] = ['fa', 'en'];

export const AudioMimeTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg'];
export const ImageMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];
export const VideoMimeTypes = ['video/mp4', 'video/webm'];
export const TextMimeTypes = ['application/xml', 'application/json', 'text/plain', 'application/msword'];
export const ArchiveMimeTypes = ['application/zip', 'application/gzip', 'application/x-7z-compressed', 'application/vnd.rar'];
export const ExecuteMimeTypes = ['application/x-sega-cd-rom', 'application/vnd.android.package-archive'];

export type MimeTypes = '*' | 'audio/mp3' | 'audio/wav' | 'audio/mpeg' | 'image/png' | 'image/jpeg' | 'image/gif' | 'video/mp4' | 'video/webm' | 'video/mpeg' | 'video/ogg' | 'application/xml' | 'application/json' | 'text/plain' | 'application/zip' | 'application/gzip' | 'application/x-7z-compressed' | 'application/vnd.rar' | 'application/x-sega-cd-rom' | 'application/vnd.android.package-archive' | 'image/*' | 'application/pdf' | 'audio/*' | 'video/*' | 'application/x-mpegurl' | 'application/msword' | 'application/xls';

export const ExecuteExtensions = ['exe', 'sh'];
export const ImageExtensions = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
export const AudioExtensions = ['mp3', 'wav'];
export const TextExtensions = ['txt', 'json', 'xml', 'md', 'js', 'css'];
export const VideoExtensions = ['mp4', 'avi', 'webm'];
export const ArchiveExtensions = ['zip', 'gz', '7z'];
