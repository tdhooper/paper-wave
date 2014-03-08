require.config({
    paths: {   
        'paper' : "../bower_components/paper/dist/paper",
        'underscore' : "../bower_components/underscore/underscore"
    },
    shim: {
        'paper': {
            'exports': 'paper'
        }
    }
});

require(['app/paper-wave'], function(PaperWave) {
    var paperWave = PaperWave.create({
        canvas: document.getElementById('paperWave'),
        segments: 12,
        width: 1000,
        height: 500
    });
    paperWave.start();
});
