
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const DEFAULT: CustomThemeConfig = {
    name: 'DEFAULT',
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        "--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        "--theme-font-color-base": "0 0 0",
        "--theme-font-color-dark": "255 255 255",
        "--theme-rounded-base": "8px",
        "--theme-rounded-container": "8px",
        "--theme-border-base": "1px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "0 0 0",
        "--on-secondary": "0 0 0",
        "--on-tertiary": "0 0 0",
        "--on-success": "0 0 0",
        "--on-warning": "0 0 0",
        "--on-error": "0 0 0",
        "--on-surface": "255 255 255",
        // =~= Theme Colors  =~=
        // primary | #da8bfb 
        "--color-primary-50": "249 238 254", // #f9eefe
        "--color-primary-100": "248 232 254", // #f8e8fe
        "--color-primary-200": "246 226 254", // #f6e2fe
        "--color-primary-300": "240 209 253", // #f0d1fd
        "--color-primary-400": "229 174 252", // #e5aefc
        "--color-primary-500": "218 139 251", // #da8bfb
        "--color-primary-600": "196 125 226", // #c47de2
        "--color-primary-700": "164 104 188", // #a468bc
        "--color-primary-800": "131 83 151", // #835397
        "--color-primary-900": "107 68 123", // #6b447b
        // secondary | #6bdbd4 
        "--color-secondary-50": "233 250 249", // #e9faf9
        "--color-secondary-100": "225 248 246", // #e1f8f6
        "--color-secondary-200": "218 246 244", // #daf6f4
        "--color-secondary-300": "196 241 238", // #c4f1ee
        "--color-secondary-400": "151 230 225", // #97e6e1
        "--color-secondary-500": "107 219 212", // #6bdbd4
        "--color-secondary-600": "96 197 191", // #60c5bf
        "--color-secondary-700": "80 164 159", // #50a49f
        "--color-secondary-800": "64 131 127", // #40837f
        "--color-secondary-900": "52 107 104", // #346b68
        // tertiary | #444a74 
        "--color-tertiary-50": "227 228 234", // #e3e4ea
        "--color-tertiary-100": "218 219 227", // #dadbe3
        "--color-tertiary-200": "208 210 220", // #d0d2dc
        "--color-tertiary-300": "180 183 199", // #b4b7c7
        "--color-tertiary-400": "124 128 158", // #7c809e
        "--color-tertiary-500": "68 74 116", // #444a74
        "--color-tertiary-600": "61 67 104", // #3d4368
        "--color-tertiary-700": "51 56 87", // #333857
        "--color-tertiary-800": "41 44 70", // #292c46
        "--color-tertiary-900": "33 36 57", // #212439
        // success | #46d2b6 
        "--color-success-50": "227 248 244", // #e3f8f4
        "--color-success-100": "218 246 240", // #daf6f0
        "--color-success-200": "209 244 237", // #d1f4ed
        "--color-success-300": "181 237 226", // #b5ede2
        "--color-success-400": "126 224 204", // #7ee0cc
        "--color-success-500": "70 210 182", // #46d2b6
        "--color-success-600": "63 189 164", // #3fbda4
        "--color-success-700": "53 158 137", // #359e89
        "--color-success-800": "42 126 109", // #2a7e6d
        "--color-success-900": "34 103 89", // #226759
        // warning | #d77f2d 
        "--color-warning-50": "249 236 224", // #f9ece0
        "--color-warning-100": "247 229 213", // #f7e5d5
        "--color-warning-200": "245 223 203", // #f5dfcb
        "--color-warning-300": "239 204 171", // #efccab
        "--color-warning-400": "227 165 108", // #e3a56c
        "--color-warning-500": "215 127 45", // #d77f2d
        "--color-warning-600": "194 114 41", // #c27229
        "--color-warning-700": "161 95 34", // #a15f22
        "--color-warning-800": "129 76 27", // #814c1b
        "--color-warning-900": "105 62 22", // #693e16
        // error | #ea1f52 
        "--color-error-50": "252 221 229", // #fcdde5
        "--color-error-100": "251 210 220", // #fbd2dc
        "--color-error-200": "250 199 212", // #fac7d4
        "--color-error-300": "247 165 186", // #f7a5ba
        "--color-error-400": "240 98 134", // #f06286
        "--color-error-500": "234 31 82", // #ea1f52
        "--color-error-600": "211 28 74", // #d31c4a
        "--color-error-700": "176 23 62", // #b0173e
        "--color-error-800": "140 19 49", // #8c1331
        "--color-error-900": "115 15 40", // #730f28
        // surface | #292929 
        "--color-surface-50": "225 225 225", // #dfdfdf
        "--color-surface-100": "212 212 212", // #d4d4d4
        "--color-surface-200": "202 202 202", // #cacaca
        "--color-surface-300": "169 169 169", // #a9a9a9
        "--color-surface-400": "155 155 155", // #696969
        "--color-surface-500": "41 41 41", // #292929
        "--color-surface-600": "37 37 37", // #252525
        "--color-surface-700": "31 31 31", // #1f1f1f
        "--color-surface-800": "25 25 25", // #191919
        "--color-surface-900": "20 20 20", // #141414

    }
}