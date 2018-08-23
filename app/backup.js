const Promise = require('bluebird');
var seconds = 10;
const users = {};

module.exports = function (bot) {
    var player_funcs = new bot.infra.player_funcs();

    bot.on(/^\/explore (.+)$/, (msg, props) => {
        let maps = {
            green_woods: function (msg, map) {
                bot.sendMessage(msg.from.id, 'You started exploring the Green Woods');
                exploreWrapper(msg, map);
            },
            dark_forest: function (msg, map) {
                bot.sendMessage(msg.from.id, 'You started exploring the Dark Forest');
                exploreWrapper(msg, map);
            },
            bat_cave: function (msg, map) {
                bot.sendMessage(msg.from.id, 'You started exploring the Bat Cave');
                exploreWrapper(msg, map);
            },
            deep_below: function (msg, map) {
                bot.sendMessage(msg.from.id, 'You started exploring the Deep Below');
                exploreWrapper(msg, map);
            }
        };
        player_funcs.handlePlayerExists(msg,bot)
            .then(function (resolve) {//resolve is player if found
                const map = props.match[1];
                if (!users[msg.from.username]) {//if player is not on users{}
                    users[msg.from.username] = {
                        "WantsToExplore": true,
                        "hasReturned": false,
                        "exploring": false
                    };
                } else {//if player is on users{}
                    if (users[msg.from.username].hasReturned == false) {
                        bot.sendMessage(msg.from.id, 'You are already exloring or did not return yeet');
                        return;
                    }
                    users[msg.from.username].WantsToExplore = true;
                }
                if (users[msg.from.username].exploring == false) {
                    if (maps[map]) {
                        maps[map](msg, map);
                    } else bot.sendMessage(msg.from.id, 'Invalid map, use /start to see all available maps');
                } else bot.sendMessage(msg.from.id, 'You are already exploring or did not return yeet');
            })
            .catch(function (reject) {
                return bot.sendMessage(msg.from.id, 'use /register to set up an account');
            });
    });

    bot.on('/stop_exploring', (msg) => {
        player_funcs.handlePlayerExists(msg,bot)
            .then(function (resolve) {//resolve is player if found
                if (!users[msg.from.username]) {
                    users[msg.from.username] = {
                        "WantsToExplore": false,
                        "exploring": false
                    };
                } else {
                    users[msg.from.username].WantsToExplore = false;
                    users[msg.from.username].exploring = false;
                    if (users[msg.from.username].hasReturned == false) {
                        return;
                    }
                }
                return bot.sendMessage(msg.from.id, 'You will stop exploring as soon as a battle happens or you die.');
            })
            .catch(function (reject) {
                return bot.sendMessage(msg.from.id, 'use /register to set up an account');
            });
    });

    function exploreWrapper(msg, map) {
        player_funcs.handlePlayerExists(msg,bot)
            .then(function (resolve) {//resolve is player if found
                let playerFactory = new bot.factory.player_factory();
                let player = playerFactory.calculateStatsForPlayer(resolve, bot);

                let monster_factory = new bot.factory.monster_factory();
                let monster = monster_factory.getMonster(map, bot);

                users[msg.from.username].exploring = true;

                setImmediate(() => Promise.delay(seconds * 1000)
                    .then(() => {
                        bot.sendMessage(msg.from.id, battle(player, monster, msg, map, users[msg.from.username].WantsToExplore));
                    }));
            });
    }

    //this is the mess fix it
    function battle(player, monster, msg, map, wants) {
        let startMessage = '', battleLog = '';
        let playerIniciative = dice(20);
        let monsterIniciative = dice(20);
        let playerMaxHp = player.hp;
        let monsterMaxHp = monster.hp;
        battleLog += `🔶${monster.name} rolled a ${monsterIniciative}\n`;
        battleLog += `🔷${player.name} rolled a ${playerIniciative}\n\n`;
        if (playerIniciative > monsterIniciative) battleLog += `${player.name} won the initiative!\n\n`;
        else battleLog += `${monster.name} won the initiative!\n\n`;

        while (monster.hp > 0) {
            if (playerIniciative > monsterIniciative) {
                //player turn
                let player_accuracy = dice(player.accuracy);
                let monster_flee = dice(monster.flee);
                let player_damage = dice(player.autoAttackDmg);
                battleLog += `🔷 🎯${player_accuracy}  💢${player_damage}  ✨${monster_flee}\n`;
                if (player_accuracy >= monster_flee) {
                    battleLog += `${player.name} dealt ${player_damage} damage to ${monster.name}\n`;
                    monster.hp -= player_damage;
                    //skills
                    var i;
                    for (i in player.skills) {
                        let rand = dice(100);
                        if (rand < player.skills[i].odds) {
                            let skill_damage = player.skills[i].damage() / 2;
                            skill_damage += dice(player.skills[i].damage() / 2);
                            battleLog += `${player.skills[i].emoji} ${player.skills[i].skill_name} cast for ${skill_damage} damage\n`;
                            monster.hp -= skill_damage;
                        }
                    }
                    battleLog += `${monster.name}'s hp: ${monster.hp}/${monsterMaxHp}\n\n`;
                    if (monster.hp <= 0) {
                        startMessage += `✔️${player.name} vs. ${monster.name}!\n\n`;
                        battleLog += `🆙 Experience: ${monster.exp} \n🎲 Loot: \n🎩 Equip:`;
                        player_funcs.addExp(msg, monster.exp,bot);
                        if (wants == true) exploreWrapper(msg, map);
                        else {
                            battleLog += '\n\nYou stoped exploring!';
                            users[msg.from.username].hasReturned = true;
                        }
                        return startMessage + battleLog;
                    }
                } else {
                    battleLog += `${player.name} missed the attack\n   miss\n\n`;
                }
                //monster turn
                let monster_accuracy = dice(monster.accuracy);
                let player_flee = dice(player.flee);
                let monster_damage = dice(monster.autoAttackDmg);
                battleLog += `🔶 🎯${monster_accuracy}  💢${monster_damage}  ✨${player_flee}\n`;
                if (monster_accuracy >= player_flee) {
                    battleLog += `${monster.name} dealt ${monster_damage} damage to ${player.name}\n`
                    player.hp -= monster_damage;
                    battleLog += `${player.name} hp: ${player.hp}/${playerMaxHp}\n\n`
                    if (player.hp <= 0) {
                        startMessage += `❌${player.name} vs. ${monster.name}!\n\n`;
                        battleLog += "You died! Use the buttons to try again B";
                        users[msg.from.username].exploring = false;
                        users[msg.from.username].hasReturned = true;
                        return startMessage + battleLog;
                    }
                } else {
                    battleLog += `${monster.name} missed the attack\n   miss\n\n`;
                }
            } else {
                //monster turn
                let monster_accuracy = dice(monster.accuracy);
                let player_flee = dice(player.flee);
                let monster_damage = dice(monster.autoAttackDmg);
                battleLog += `🔶 🎯${monster_accuracy}  💢${monster_damage}  ✨${player_flee}\n`;
                if (monster_accuracy >= player_flee) {
                    battleLog += `${monster.name} dealt ${monster_damage} damage to ${player.name}\n`
                    player.hp -= monster_damage;
                    battleLog += `${player.name} hp: ${player.hp}/${playerMaxHp}\n\n`
                    if (player.hp <= 0) {
                        startMessage += `❌${player.name} vs. ${monster.name}!\n\n`;
                        battleLog += "You died! Use the buttons to try again A";
                        users[msg.from.username].exploring = false;
                        users[msg.from.username].hasReturned = true;
                        return startMessage + battleLog;
                    }
                } else {
                    battleLog += `${monster.name} missed the attack\n   miss\n\n`;
                }

                //player turn
                let player_accuracy = dice(player.accuracy);
                let monster_flee = dice(monster.flee);
                let player_damage = dice(player.autoAttackDmg);
                battleLog += `🔷 🎯${player_accuracy}  💢${player_damage}  ✨${monster_flee}\n`;
                if (player_accuracy >= monster_flee) {
                    battleLog += `${player.name} dealt ${player_damage} damage to ${monster.name}\n`;
                    monster.hp -= player_damage;
                    //skills
                    var i;
                    for (i in player.skills) {
                        let rand = dice(100);
                        if (rand < player.skills[i].odds) {
                            let skill_damage = player.skills[i].damage() / 2;
                            skill_damage += dice(player.skills[i].damage() / 2);
                            battleLog += `${player.skills[i].emoji} ${player.skills[i].skill_name} cast for ${skill_damage} damage\n`;
                            monster.hp -= skill_damage;
                        }
                    }
                    battleLog += `${monster.name}'s hp: ${monster.hp}/${monsterMaxHp}\n\n`;
                    if (monster.hp <= 0) {
                        startMessage += `✔️${player.name} vs. ${monster.name}!\n\n`;
                        battleLog += `🆙 Experience: ${monster.exp} \n🎲 Loot: \n🎩 Equip:`;
                        player_funcs.addExp(msg, monster.exp,bot);
                        if (wants == true) exploreWrapper(msg, map);
                        else {
                            battleLog += '\n\nYou stoped exploring!';
                            users[msg.from.username].hasReturned = true;
                        }
                        return startMessage + battleLog;
                    }
                } else {
                    battleLog += `${player.name} missed the attack\n   miss\n\n`;
                }
            }
        }
        return startMessage + battleLog;
    }

    function dice(faces) {
        return Math.floor((Math.random() * faces + 1) + 1);
    }

}