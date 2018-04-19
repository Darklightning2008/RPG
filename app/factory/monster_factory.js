function player_factory() { }

player_factory.prototype.getMonster = function (map, bot) {

    let monster_stats = {
        name: 'VAIII',
        hp: 0,
        sp: 0,
        autoAttackDmg: 0,
        flee: 0,
        accuracy: 0,
        iniciative_bonus: 0,
        occurrence: 0,
        exp: 0
    };

    function solver(map_by_name) {
        var possibleMonsters = map_by_name.getMonsters();
        var i = Math.floor(Math.random() * possibleMonsters.length);
        monster_stats.name = possibleMonsters[i].name;
        monster_stats.hp = possibleMonsters[i].hp;
        monster_stats.sp = possibleMonsters[i].sp;
        monster_stats.autoAttackDmg = possibleMonsters[i].autoAttackDmg;
        monster_stats.flee = possibleMonsters[i].flee;
        monster_stats.accuracy = possibleMonsters[i].accuracy;
        monster_stats.iniciative_bonus = possibleMonsters[i].iniciative_bonus;
        monster_stats.exp = possibleMonsters[i].exp;
    }
    if (map == 'green_woods') {
        solver(new bot.maps.green_woods());
    }
    return monster_stats;
};

module.exports = function () {
    return player_factory;
};
