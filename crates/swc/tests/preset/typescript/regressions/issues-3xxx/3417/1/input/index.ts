export function selectRooms(building: Building) {
    const roomsByRow: { [key: string]: [string, string, string, string] } = {};

    const { rooms, walls, levels, roomsByLevel } = building;

    function getRoomFloorMaterial(_: Room) {
        return null;
    }

    for (const level of levels) {
        const levelId = level.id;
        const levelRooms = roomsOnLevel(levelId, rooms, roomsByLevel);

        const sortedRooms: Room[] = [];
        for (const room of levelRooms) {
            sortedRooms.push(room);
        }

        sortedRooms.sort((a, b) => a + b);

        const visitedRooms: { [roomId: string]: boolean } = {};

        for (const room of sortedRooms) {
            if (visitedRooms[room.id]) {
                continue;
            }

            const connectedRoomSet: RoomSet = [];
            const roomPrettyName = formatRoomName(room);
            const roomFloorMat = getRoomFloorMaterial(room);

            groupRoomsOnLevel(
                room,
                walls,
                (_, endRoom, wall) =>
                    wall.wallType === WallType.VOID &&
                    roomPrettyName.toUpperCase() ===
                        formatRoomName(endRoom).toUpperCase() &&
                    roomFloorMat === getRoomFloorMaterial(endRoom),
                (room) => connectedRoomSet.push(room),
                visitedRooms
            );

            let areaTotal = 0;
            for (const setRoom of connectedRoomSet) {
                const wallIndex = walls[levelId].wallIndex;
            }

            areaTotal = Math.round(areaTotal) / 10;
            roomsByRow[room.id] = [
                roomPrettyName,
                `${areaTotal} SF`,
                roomFloorMat,
                FLOOR_MAPPING[levelId],
            ];
        }
    }
    return { rows: Object.values(roomsByRow) };
}
