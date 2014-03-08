define(['app/simulation'], function(Simulation) {

    var PaperWave = {};

    PaperWave.create = function(spec) {
        var that = {};

        that.start = function() {
            spec.canvas.width = spec.width;
            spec.canvas.height = spec.height;
            that.simulation.start();
        };

        that.simulation = Simulation.create(spec);

        return that;
    };

    return PaperWave;
});