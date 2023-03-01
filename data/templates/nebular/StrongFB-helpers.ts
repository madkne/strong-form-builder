

export namespace StrongFBHelper {
    export function notifyBackgroundColor() {
        return "var(--card-background-color, #ffffff)";
    }
    export function notifyTextColor() {
        return "var(--card-text-color, #222b45)";
    }
    export function notifyTitleColor() {
        return "var(--card-header-success-text-color)";
    }

    export function loadingTextColor() {
        return "var(--button-filled-primary-hover-border-color, #598bff)";
    }

}