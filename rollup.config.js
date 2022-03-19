import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';

const distDir = './dist'

export default {
    input: 'src/index.js',
    plugins: [
        replace({
            include: './src/**/*.js',
            delimiters: ['', ''],
            '/assets/': '/official/assets/'
        }),
        resolve(),
        copy({
            targets: [
                { src: './index.html', dest: distDir },
                { src: './assets', dest: distDir },
            ],
        }),
    ],
    output: {
        format: 'iife',
        file: `${distDir}/index.js`,
    },
};
