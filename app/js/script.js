'use strict';

var cubeHelper = (function () {
    var DEFAULT_COLORS = ["#646464", "#5B6C98", "#FFFFFF", "#FD8C3C", "#84d2a8", "#f6dc64", "#dd362a"];
    var helpers = {'onSave': wait};
    var element, // cube with edition mode (focus + interaction)
        elementCopy, // cube copy (lighter cube to be stored)
        selectedFace, // selected cube face
        colorJson, // config file
        colors = [], // cube possible colors (color DOM element)
        xhr = new XMLHttpRequest,
        fs = require('fs'),
        path = require('path'),
        process = require('process');

    var localDir = process.execPath.substr(0, process.execPath.lastIndexOf(path.sep));
    fs.readFile(localDir + path.sep + 'colors.json', 'utf8', function (err, data) {
        var colorList = DEFAULT_COLORS;

        if (!err) {
            colorJson = JSON.parse(data);
            colorList = colorJson.colors;
        }

        colorList.forEach(function (color, index) {
            var colorId = index + 1;
            var cubeColor = document.getElementById("color" + colorId);
            if (cubeColor) {
                cubeColor.value = color;
                cubeColor.onchange = updateColor;
                colors.push(cubeColor);
            }
        });

        xhr.open('get', 'img/cube.svg', true);
        xhr.onreadystatechange = onCubeLoaded;
        xhr.send();
    });

    function onCubeLoaded() {
        if (xhr.readyState != 4) return;
        var svg = xhr.responseXML.documentElement;
        svg = document.importNode(svg, true);
        element = document.body.appendChild(svg);

        var blocs = element.getElementsByClassName("bloc-face");

        for (var i = 0; i < blocs.length; i++) {
            var bloc = blocs[i];
            bloc.id = "bloc_" + i;
            bloc.setAttribute("fill", colors[0].value);
        }

        var svgCopy = element.cloneNode(true);
        elementCopy = document.body.appendChild(svgCopy);

        var blocsCopy = elementCopy.getElementsByClassName("bloc-face");

        for (var i = 0; i < blocsCopy.length; i++) {
            var bloc = blocsCopy[i];
            bloc.id = 'copy_' + bloc.id;
            bloc.classList.add('bloc-copy');

            bloc.setAttribute("fill", colors[0].value);

            bloc.classList.add(colors[0].id);

        }

        element.style.display = "none";
    }

    function updateColor() {
        var blocsCopy = document.getElementsByClassName(this.id);
        for (var i = 0; i < blocsCopy.length; i++) {
            var bloc = blocsCopy[i];
            bloc.setAttribute("fill", this.value);

            var realId = bloc.id.replace('copy_', '');
            var face = document.getElementById(realId);
            face.setAttribute("fill", this.value);
        }

    }

    function setColorToFace(bloc, color, oldColor) {
        bloc.setAttribute("fill", color.value);
        bloc.classList.remove(oldColor.id);
        bloc.classList.add(color.id);

        var realId = bloc.id.replace('copy_', '');
        var face = document.getElementById(realId);
        face.setAttribute("fill", color.value);
    }

    function getColorFromFace(face) {
        var color = null;
        colors.forEach(function (c) {
            if (face.getAttribute("fill").toLowerCase() === c.value) {
                color = c;
            }
        });
        return color;
    }

    document.onkeydown = function (e) {
        if (!selectedFace) {
            return;
        }

        e = e || window.event;

        if (e.keyCode == '38' || e.keyCode == '37') {
            // up/left arrow
            var oldColor = getColorFromFace(selectedFace);
            oldColor.style.border = "";

            var indexOfColor = colors.indexOf(oldColor);
            indexOfColor = indexOfColor - 1;
            if (indexOfColor < 0) indexOfColor = colors.length - 1;

            setColorToFace(selectedFace, colors[indexOfColor], oldColor);

            var newColor = getColorFromFace(selectedFace);
            newColor.style.border = "3px solid black";
        }
        else if (e.keyCode == '40' || e.keyCode == '39') {
            // down/right arrow
            var oldColor = getColorFromFace(selectedFace);
            oldColor.style.border = "";

            var indexOfColor = colors.indexOf(oldColor);
            indexOfColor = indexOfColor + 1;
            if (indexOfColor >= colors.length) indexOfColor = 0;

            setColorToFace(selectedFace, colors[indexOfColor], oldColor);

            var newColor = getColorFromFace(selectedFace);
            newColor.style.border = "3px solid black";
        }
    }

    $(document).on('click', 'path', function () {
        if (this.id.indexOf('copy_bloc_') !== -1) {
            if (selectedFace) {
                selectedFace.setAttribute("stroke-width", "0");
                var oldColor = getColorFromFace(selectedFace);
                oldColor.style.border = "";
                if (selectedFace == this) {
                    selectedFace = null;
                    return;
                }
            }
            selectedFace = this;
            selectedFace.setAttribute("stroke", "black");
            selectedFace.setAttribute("stroke-width", "5px");

            var color = getColorFromFace(selectedFace);
            color.style.border = "3px solid black";

        }
        //Do the stuff
    });

    document.getHTML = function (who, deep) {
        if (!who || !who.tagName) return '';
        var txt, ax, el = document.createElement("div");
        el.appendChild(who.cloneNode(false));
        txt = el.innerHTML;
        if (deep) {
            ax = txt.indexOf('>') + 1;
            txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
        }
        el = null;
        return txt;
    }

    var buildFile = function (name, value) {
        var img = new Buffer(value);
        fs.writeFile(name, img, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }

    function wait() {
        $('#close-popup').click();
        setTimeout(function () {
            screen_shot()
        }, 10);
    }

    function screen_shot() {
        query_for_save_path(function (save_path) {
            buildFile(save_path, document.getHTML(element, true));
            alert('Cube saved to: ' + save_path);
        });
    }

    function query_for_save_path(cb) {
        $('#dialog').show();
        $('#dialog input').one('change', function (event) {
            cb($(this).val());
        });
    }

    return helpers;

})();