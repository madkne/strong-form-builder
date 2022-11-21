import { ButtonAppearance, ButtonStatus } from "../../common/StrongFB-types";
import { StrongFBButtonWidget } from "./button.header";



export type ButtonSize = 'small' | 'medium' | 'large';


export type ButtonShape = 'rectangle' | 'round';
export type ButtonMode = 'iconButton' | 'text' | 'iconBeforeText' | 'iconAfterText' | 'icon';

export type ButtonClickEvent = (event?: MouseEvent, self?: StrongFBButtonWidget) => Promise<any> | any;

export interface ButtonSchema {
    /**
     * @default medium
     */
    size?: ButtonSize;
    /**
     * @default fill
     */
    appearance?: ButtonAppearance;
    /**
     * @default rectangle
     */
    shape?: ButtonShape;
    /**
     * @default default
     */
    status?: ButtonStatus;
    /**
     * @default false
     */
    disabled?: boolean;
    text?: string;
    /**
     * @default false
     */
    fullWidth?: boolean;
    icon?: string;
    /**
     * @default text
     */
    mode?: ButtonMode;

    tooltip?: string;
    /**
     * @default false
     */
    disabledForFormFields?: string[];

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    click?: ButtonClickEvent;
}