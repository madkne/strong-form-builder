
export type CssImageSize = 'small' | 'medium' | 'large';

export type CssImageType = 'illustration' | 'emoji';

export type CssImageName = CssImageIllustrationName | CssImageEmojiName;

export type CssImageIllustrationName = 'cactus';

export type CssImageEmojiName = 'success' | 'failed';
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