
export type CssImageSize = 'small' | 'medium' | 'large';

export type CssImageType = 'illustration';

export type CssImageName = CssImageIllustrationName;

export type CssImageIllustrationName = 'cactus';

export interface CssImageSchema {
    /**
     * @default medium
     */
    size?: CssImageSize;

    type?: CssImageType;

    name?: CssImageName;

    title?: string;

    /**
     * @default transparent
     */
    background?: string;

    height?: string;
    minHeight?: string;
}