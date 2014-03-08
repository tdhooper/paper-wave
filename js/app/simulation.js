define(['underscore', 'newton'], function(_, Newton) {

    var Simulation = {};

    Simulation.create = function(spec) {
        var that = {},
            particles,
            distance,
            startAngleA,
            startAngleB;

        that.start = function() {
            var margin = 100,
                points = createPoints({
                    start: {
                        x: margin,
                        y: spec.height * 0.25
                    },
                    end: {
                        x: spec.width - margin,
                        y: spec.height * 0.75
                    },
                    count: spec.segments
                });

            var sim = createNewtonSimulation(points);
            sim.start();
        };

        var update = function(time, simulator, totalTime) {
            var step = totalTime * 0.001,
                scale = 1;

            rotateHandle(
                particles[1],
                particles[0],
                startAngleA + (Math.sin(step) * scale)
            );
            rotateHandle(
                particles[particles.length - 2],
                particles[particles.length - 1],
                startAngleB + (Math.sin(step) * scale)
            );
        };

        var rotateHandle = function(handleParticle, pivotParticle, angle) {
            var x = pivotParticle.position.x - distance * Math.cos(angle),
                y = pivotParticle.position.y - distance * Math.sin(angle);

            handleParticle.pin(x, y);
        };

        var createPoints = function(spec) {
            var points = [],
                count = spec.count,
                xDistance = spec.end.x - spec.start.x,
                yDistance = spec.end.y - spec.start.y,
                totalDistance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) ),
                fraction = 0;

            distance = totalDistance / spec.count;

            while (count--) {
                fraction = count / (spec.count - 1);
                points.push({
                    x: spec.start.x + (xDistance * fraction),
                    y: spec.start.y + (yDistance * fraction)
                });
            }
            return points;
        };

        var createNewtonSimulation = function(points) {
            var renderer = Newton.Renderer(spec.canvas),
                sim = Newton.Simulator(update, renderer.callback),
                world = Newton.Body();
            
            particles = [];

            sim.add(world);

            _(points).each(function(point, i) {
                var particle = Newton.Particle(point.x, point.y);
                particles.push(particle);
                world.addParticle(particle);
                if (i < 2 || i > points.length - 3) {
                    particle.pin();
                }
                if (i > 0) {
                    world.DistanceConstraint(particle, particles[i - 1], 1, distance);
                }
                if (i > 1) {
                    world.AngleConstraint(particle, particles[i - 1], particles[i - 2], 1);
                }
            });

            startAngleA = getAngleBetweenPoints(points[0], points[1]);
            startAngleB = getAngleBetweenPoints(points[points.length - 1], points[points.length - 2]);

            return sim;             
        };

        var getAngleBetweenPoints = function(pointA, pointB) {
            var xDiff = pointA.x - pointB.x;
            var yDiff = pointA.y - pointB.y;
            return Math.atan2(yDiff, xDiff);
        };

        return that;
    };

    return Simulation;
});