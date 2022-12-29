

export namespace StrongFBHelper {
    export function notifyBackgroundColor() {
        return "var(--mdc-dialog-container-color, #ffffff)";
    }
    export function notifyTextColor() {
        return "var(--mdc-dialog-supporting-text-color, #222b45)";
    }
    export function notifyTitleColor() {
        return "var(--mdc-dialog-subhead-color, #222b45)";
    }

    export function loadingTextColor() {
        return "var(--mdc-dialog-supporting-text-color, #598bff)";

    }
}