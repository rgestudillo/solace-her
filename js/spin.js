var padding = { top: 0, right: 0, bottom: 0, left: 0 },
    w = 350 - padding.left - padding.right,
    h = 350 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    color = d3.scale.category20(); // category20c()

var data = [];
const db = firebase.firestore();

function fetchData() {
    return new Promise((resolve, reject) => {
        // Real-time updates
        db.collection('movies').onSnapshot(snapshot => {
            data = []; // Clear existing data array
            let start = 1;
            snapshot.forEach((doc, index) => {
                const isChecked = doc.data().checked || false; // Assuming 'checked' is a field in your document
                if (!isChecked) {
                    const item = {
                        label: doc.data().title,
                        value: start,
                    };
                    start++;
                    data.push(item);
                }
            });

            resolve(data);
        });
    });
}

// Wait for data to be fetched
fetchData().then(() => {
    // Data is now available, render the wheel
    renderWheel();
});

function renderWheel() {
    var svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width", w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);

    var container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

    var vis = container
        .append("g");

    var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });

    var arc = d3.svg.arc().outerRadius(r);

    var arcs = vis.selectAll("g.slice")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "slice");

    arcs.append("path")
        .attr("fill", function (d, i) { return color(i); })
        .attr("d", function (d) { return arc(d); });

    arcs.append("text").attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    })
        .attr("text-anchor", "end")
        .text(function (d, i) {
            return data[i].label;
        });

    container.on("click", spin);

    function spin(d) {
        container.on("click", null);
        var ps = 360 / data.length,
            rng = Math.floor((Math.random() * 1440) + 360);

        rotation = (Math.round(rng / ps) * ps);

        picked = Math.round(data.length - (rotation % 360) / ps);
        picked = picked >= data.length ? (picked % data.length) : picked;
        rotation += 90 - Math.round(ps / 2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function () {
                d3.select(".slice:nth-child(" + (picked + 1) + ") path");
                oldrotation = rotation;
                /* Get the result value from object "data" */
                console.log("Winner is: ", data[picked].label)
                document.querySelector("#picked").textContent = data[picked].label;
                /* Comment the below line for restrict spin to single time */
                container.on("click", spin);
            });
    }

    svg.append("g")
        .attr("transform", "translate(" + (w) + "," + ((h / 2) + padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
        .style({ "fill": "black" });

    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 50)
        .style({ "fill": "#032023", "cursor": "pointer" });

    container.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text("SPIN")
        .style({ "font-weight": "bold", "font-size": "20px", "fill": "#FFB800" });

    function rotTween(to) {
        var i = d3.interpolate(oldrotation % 360, rotation);
        return function (t) {
            return "rotate(" + i(t) + ")";
        };
    }
}
