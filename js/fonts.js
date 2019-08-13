var html = document.documentElement;

var fontsfile = document.createElement('link');
fontsfile.href = pathTemplate + 'css/fonts.css';
fontsfile.rel = 'stylesheet';
document.head.appendChild(fontsfile);

if (sessionStorage.fontsLoaded) {
    html.classList.add('fonts-loaded');
} else {
    var script = document.createElement('script');
    script.src = pathTemplate + 'js/fontfaceobserver.js';
    script.async = true;

    script.onload = function () {
        var Rubik300 = new FontFaceObserver('Rubik', {
            weight: '300'
        });
        var Rubik400 = new FontFaceObserver('Rubik', {
            weight: 'normal'
        });
        var Rubik500 = new FontFaceObserver('Rubik', {
            weight: '500'
        });

        Promise.all([
            Rubik300.load(),
            Rubik400.load(),
            Rubik500.load()
        ]).then(function () {
            html.classList.add('fonts-loaded');
            sessionStorage.fontsLoaded = true;
        });
    };
    document.head.appendChild(script);
}