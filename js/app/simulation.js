define(['underscore'], function(_) {

    var Simulation = {};

    Simulation.create = function(spec) {
        var that = {};

        that.start = function() {
            that.state = {
                edges: []
            };
            var count = spec.segments + 1;
            while (count--) {
                that.state.edges.push({
                    va: {x: 0, y: 0}
                });
            }            
        };

        that.update = function() {
            _(that.state.edges).each(function(edge) {
                edge.va.x = Math.random() * spec.width;
                edge.va.y = Math.random() * spec.height;
            });
        };

        return that;
    };

    return Simulation;
});