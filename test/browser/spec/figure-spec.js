describe("Figure API", function () {
    var host = "http://localhost:8000/";
    
    it("can fetch figures for group, scene, and version", function (done) {
        sendRequest(host + "group/1/scene/1/version/1/figure", "GET").then(function (data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it("can fetch figure for group, scene, version, and id", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            figureID = 1,
            url = host;

            url += "group/" + groupID + "/";
            url += "scene/" + sceneID + "/";
            url += "version/" + versionID + "/";
            url += "figure/" + figureID;

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.id).toBe(figureID);
            expect(data.versionId).toBe(versionID);
            done();
        });
    });

    it("can fetch all figures from root", function (done) {
        var url = host + "figure";

        sendRequest(url, "GET").then(function (data) {
            expect(data).toBeDefined();
            expect(data.items).toBeDefined();
            expect(data.items.length).toBeGreaterThan(0);
            done();
        });
    });

    it("can fetch figure from root", function (done) {
        var figureID = 5,
            url = host + "figure/" + figureID;

        sendRequest(url, "GET").then(function (data) {
            
            expect(data).toBeDefined();
            expect(data.id).toBe(figureID);
            done();
        });
    });

    it("can edit figure at root", function (done) {
        var figureID = 5,
            url = host + "figure/" + figureID,
            rand = "Figure " + (Math.random() * 10).toFixed(3);
            

        sendRequest(url, "GET").then(function (data) {
            data.name = rand;
            return sendRequest(url, "PUT", data);
        }).then(function (result) {
            return sendRequest(url, "GET");
        }).then(function (data) {
            expect(data.name).toEqual(rand);
            done();
        });     
    });

    it("can move figure with position", function (done) {
        var groupID = 1,
            sceneID = 1,
            versionID = 1,
            allFigureURL = host,
            url = host + "figure/",
            newPosition = 2,
            figureID,
            toMove;

            allFigureURL += "group/" + groupID + "/";
            allFigureURL += "scene/" + sceneID + "/";
            allFigureURL += "version/" + versionID + "/";
            allFigureURL += "figure/";

        sendRequest(allFigureURL, "GET").then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0];
                toMove = root.children[1];
            
            url += toMove.id;
            figureID = toMove.id;
            return sendRequest(url, "PUT", {
                position: newPosition
            });
        }).then(function (data) {
            return sendRequest(allFigureURL, "GET");
        }).then(function (data) {
            var figures = buildFiguresCache(data.items),
                roots = figures.tree,
                root = roots[0],
                moved = root.children[newPosition];

            expect(moved).toBeDefined();
            expect(moved.id).toEqual(figureID);
            done();
        });

    });


    // it("can edit figure parent", function (done) {
    //     var figureID = 11,
    //         parentIDs = [1, 2, 6],
    //         url = host + "figure/" + figureID,
    //         rand = "Figure " + (Math.random() * 10).toFixed(3),
    //         parentID, index, versionID, figuresByID, parent, child;
            

    //     sendRequest(url, "GET").then(function (data) {
    //         parentID = +data.parentId;
    //         versionID =  +data.versionId;
    //         index = parentIDs.indexOf(parentID);
    //         index = (index + 1) % parentIDs.length;
    //         parentID = parentIDs[index];
    //         data.parentId = parentID;
    //         return sendRequest(url, "PUT", data);
    //     }).then(function (result) {
    //         var versionURL = host + "version/" + versionID + "/figure";
    //         return Promise.all([
    //             sendRequest(url, "GET"),
    //             sendRequest(versionURL, "GET")
    //         ]);
    //     }).then(function (results) {
    //         figure = results[0];
    //         expect(+figure.parentId).toEqual(parentID);
    //         figuresByID = buildFiguresCache(results[1].items).byID;
    //         parent = figuresByID[figure.parentId];
    //         child = figuresByID[figure.id];
    //         index = parent.children.indexOf(child);
    //         expect(index).toEqual(figure.position);
    //         done();
    //     });               
    // });

});