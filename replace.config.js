module.exports = {
    files: './dist/index.html',
    from: [
        /\/assets\//g,
        /type="module"/g,
        /\.\/src\/index\.js/g,
    ],
    to: [
        '/official/assets/',
        '',
        'index.js'
    ]
};