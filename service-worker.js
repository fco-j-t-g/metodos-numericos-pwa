const CACHE_NAME =
    "metodos-numericos-v1";

const FILES_TO_CACHE = [

    "./",
    "./index.html",

    "./css/styles.css",

    "./pages/roots.html",
    "./pages/interpolation.html",
    "./pages/regression.html",
    "./pages/systems.html",

    "./js/app.js",

    "./js/roots/bisection.js",
    "./js/roots/newtonRaphson.js",
    "./js/roots/secant.js",
    "./js/roots/rootsPage.js",

    "./js/interpolation/linearInterpolation.js",
    "./js/interpolation/lagrange.js",
    "./js/interpolation/interpolationPage.js",

    "./js/regression/linearRegression.js",
    "./js/regression/polynomialRegression.js",
    "./js/regression/RegressionPage.js",

    "./js/systems/gaussJordan.js",
    "./js/systems/SystemsPage.js"
];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(cache => {
                return cache.addAll(
                    FILES_TO_CACHE
                );
            })
        );
    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(response => {

                return (
                    response ||
                    fetch(
                        event.request
                    )
                );
            })
        );
    }
);