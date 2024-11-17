import {defineSlotRecipe} from "@pandacss/dev";

/** Styling recipe. */
export const informationRowRecipe = defineSlotRecipe({
    className: 'information-row',
    description: 'Styles for information row component.',
    slots: ['root', 'iconContainer', 'title', 'data', 'icon'],
    base: {
        iconContainer: { bg: 'accent.3' },
        title: { fontWeight: 'semibold', lineHeight: 'tight', as: 'span' },
        data: { lineHeight: 'tight', as: 'span' }
    },
    variants: {
        size: {
            xs: {
                root: { gap: 1 },
                title: { display: 'none' },
                data: { fontSize: 'sm' },
                iconContainer: { p: 0, bg: 'transparent' },
                icon: { size: '12px', strokeWidth: '1.5' }
            },
            sm: {
                root: { gap: 2 },
                iconContainer: { p: 2 },
                icon: { size: '20px' },
                title: { fontSize: 'md' },
                data: { fontSize: 'sm' }
            },
            md: {
                root: { gap: 4 },
                iconContainer: { p: 4 },
                icon: { size: '24px' },
                title: { fontSize: 'lg' },
                data: { fontSize: 'md' }
            }
        },
    },
    defaultVariants: {
        size: 'md'
    }
})