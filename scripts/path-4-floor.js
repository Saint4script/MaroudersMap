const APItoLayoutMap = {
    "11505" : {
        "publicName": "Gym", 
        "layoutName": "cab-5-place"
    },
    "6070" : {
        "publicName": "Cloakroom", 
        "layoutName": "cab-6-place"
    },
    "10861" : {
        "publicName": "Conference", 
        "layoutName": "cab-10-place"
    },
    "12143" : {
        "publicName": "bookkeepering", 
        "layoutName": "cab-12-place"
    },
    "7665" : {
        "publicName": "Denis", 
        "layoutName": "cab-14-place"
    },
    "12462" : {
        "publicName": "Vepp 2", 
        "layoutName": "cab-15-place"
    },
    "5751" : {
        "publicName": "Vepp 1", 
        "layoutName": "cab-16-place"
    },
    "25956" : {
        "publicName": "4 этаж", 
        "layoutName": "cab-1-8-place"
    },
    "134877" : {
        "publicName": "выход совсем", 
        "layoutName": "???"// уходит вникуда----------------------------------------------
    }
};

const roomMap = {
    "1-0": {
        name: "коридор 1",
        routes: ["1-1", "9", "12-1", "15"]
    },
    "1-1": {
        name: "коридор 1",
        routes: ["1-0", "1-2"]
    },
    "1-2": {
        name: "коридор 1",
        routes: ["10", "1-1", "1-3"]
    },
    "1-3": {
        name: "коридор 1",
        routes: ["5-0", "1-4", "1-2"]
    },
    "1-4": {
        name: "коридор 1",
        routes: ["16", "8", "1-3", "1-5"]
    },
    "1-5": {
        name: "коридор 1",
        routes: ["6", "1-6", "1-4"]
    },
    "1-6": {
        name: "коридор 1",
        routes: ["3", "1-7", "1-5"]
    },
    "1-7": {
        name: "коридор 1",
        routes: ["4", "1-6", "1-8"]
    },
    "1-8": {
        name: "коридор 1",
        routes: ["2-1", "1-7"]
    },
    "2": {
        name: "туалет ж",
        routes: ["2-1"]
    },
    "2-1": {
        name: "коридор 2",
        routes: ["2", "1-8"]
    },
    "3": {
        name: "туалет м",
        routes: ["1-6"]
    },
    "4": {
        name: "туалет м",
        routes: ["1-7"]
    },
    "5": {
        name: "коридор 1",
        routes: ["5-0", "5-1"]
    },
    "5-0": {
        name: "коридор 1",
        routes: ["5", "1-3"]
    },
    "5-1": {
        name: "коридор 1",
        routes: ["5", "6", "7"]
    },
    // "6-1": {
    //     name: "коридор 1",
    //     routes: ["1-5", "6"]
    // },
    "6": {
        name: "коридор 1",
        routes: ["1-5", "5-1"]
    },
    "7": {
        name: "коридор 1",
        routes: ["5-1"]
    },
    "8": {
        name: "коридор 1",
        routes: ["1-4"]
    },
    "9": {
        name: "коридор 1",
        routes: ["1-0"]
    },
    "10": {
        name: "коридор 1",
        routes: ["1-2"]
    },
    "11": {
        name: "коридор 1",
        routes: ["12-1"]
    },
    "12": {
        name: "коридор 1",
        routes: ["12-2", "12-3", "12-4"]
    },
    "12-1": {
        name: "коридор 1",
        routes: ["11", "1-0", "12-2"]
    },
    "12-2": {
        name: "коридор 1",
        routes: ["14", "12-1", "12-4"]
    },
    "12-3": {
        name: "коридор 1",
        routes: ["12-4", "13"]
    },
    "12-4": {
        name: "коридор 1",
        routes: ["12-2", "12-3", "12"]
    },
    "13": {
        name: "коридор 1",
        routes: ["12-3"]
    },
    "14": {
        name: "коридор 1",
        routes: ["12-2"]
    },
    "15": {
        name: "коридор 1",
        routes: ["1-0"]
    },
    "16": {
        name: "коридор 1",
        routes: ["1-4"]
    },
};

class FindShortRoute {
  constructor(roomMap) {
    this.roomMap = roomMap;
  }

  saveToCache(key, route) {
    if (!this.cache) {
      this.cache = {};
    }
    this.cache[key] = route;
  }

  findRoute(start, finish) {
    const key = `${start}---${finish}`;
    if (this.cache && this.cache[key]) {
      return this.cache[key];
    }
    const routes = this.findRoutes(start, finish);
    const shortRoute = routes.reduce((a, b) => (a.length <= b.length ? a : b));
    this.saveToCache(key, shortRoute);
    return shortRoute;
  }

  findRoutes(start, finish) {
    const maxLoopLength = 1000;
    let wrongFinishRoom = [];
    let candidateRoutes = [];
    let currentRoomId = start;
    let isFinding = true;
    let routes = [start];
    let i = 0;
    let candidateRoutesFlat = [];
    while (isFinding) {
      i++;
      let nextRoomId = this.getNextDoor(
        routes,
        currentRoomId,
        wrongFinishRoom,
        candidateRoutesFlat
      );
    //   console.log("next id", nextRoomId);
    //   console.log("current id", currentRoomId);
      if (nextRoomId !== null) {
        currentRoomId = nextRoomId;
        routes.push(nextRoomId);
        if (currentRoomId === finish) {
        //   console.log(
        //     JSON.stringify(routes),
        //     JSON.stringify(candidateRoutes[candidateRoutes.length - 1])
        //   );
          if (
            JSON.stringify(routes) ===
            JSON.stringify(candidateRoutes[candidateRoutes.length - 1])
          ) {
            isFinding = false;
            console.log("exit repeat route");
          } else {
            candidateRoutes.push([...routes]);
            candidateRoutesFlat = candidateRoutes.flat();
            // console.log(
            //   "exit find finish room",
            //   routes,
            //   "---------------------------------------------"
            // );
            routes = [start];
            currentRoomId = start;
          }
        }
      } else {
        if (wrongFinishRoom.includes(currentRoomId)) {
        //   console.log("exist wrong", nextRoomId);
          isFinding = false;
        } else {
        //   console.log("next wrong", [...routes]);
          wrongFinishRoom.push(currentRoomId);
          routes.pop();
          currentRoomId = routes[routes.length - 1];
        }
      }
      if (i === maxLoopLength) {
        isFinding = false;
        // console.log("exit by max count");
      }
    }

    return candidateRoutes;
  }

  getNextDoor(routes, roomId, wrongFinishRoom, candidateRoutes) {
    // console.log("gnd", [...routes], "roomId", roomId);

    let room = roomMap[roomId];
    let nextRoom = null;
    let fromCandidate;
    // console.log("can flat", candidateRoutes);
    // console.log("room", roomId);
    room.routes.some((nextRoomId) => {
      if (
        !routes.includes(nextRoomId) &&
        !wrongFinishRoom.includes(nextRoomId)
      ) {
        if (candidateRoutes.includes(nextRoomId)) {
          fromCandidate = nextRoomId;
          return false;
        }
        nextRoom = nextRoomId;
        return true;
      }
    });
    if (nextRoom == null && fromCandidate) {
      return fromCandidate;
    }
    return nextRoom;
  }
}