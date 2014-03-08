require.config({
    paths: {   
        'underscore' : "../bower_components/underscore/underscore",
        'newton' : "lib/newton/newton"
    },
    shim: {
        'newton': {
            'exports': 'Newton'
        }
    }
});

require(['app/paper-wave'], function(PaperWave) {
    var paperWave = PaperWave.create({
        canvas: document.getElementById('paperWave'),
        segments: 10,
        thickness: 50,
        width: 1000,
        height: 500
    });
    paperWave.start();
});
