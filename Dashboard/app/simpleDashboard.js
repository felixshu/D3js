/**
 * Created by Felix on 3/7/2015.
 */
function dashboard(id, fData) {
    var barColor = '#348899';

    function segColor(c) {
        return {data0: "#7BA3A8", data1: "#326C73", data2: "#F35A4A"}[c];
    }

    var ageName = d3.keys(fData[0]).filter(function (key) {
        return key !== "State";
    });

    // Total
    fData.forEach(function (d) {
        var x = 0;
        d.ages = ageName.map(function (name) {
            return {name: name, value: +d[name]}
        });

        d.total = d.ages.map(function (el) {
            return x += el.value;
        })
    });
}