function warrior() { }

warrior.prototype.getSkills = function (att) {
    /*
    Strength: 10
    Dexterity: 5
    Agility: 5
    Constitution: 5
    Intelligence: 5
    Wisdom: 5
    */
    var healingSkills = [];
    var skills = [
        {
            skill_name: "Weapon Swing (+STR)",
            damage: function () {
                return att.str;
            },
            level_required: 1,
            odds: 50,
            cost: 0,
            emoji: "😤"
        },
        {
            skill_name: "Furious Slash (+STR -INT)",
            damage: function () {
                return (att.str * 2) - att.int;
            },
            level_required: 1,
            odds: 25,
            cost: 0,
            emoji: "😤"
        },
        {
            skill_name: "Rage!!! (+STR +CON -INT)",
            damage: function () {
                return (att.str * 2) + att.con - att.int;
            },
            level_required: 1,
            odds: 25,
            cost: 0,
            emoji: "😤"
        },
        {
            skill_name: "Cross Slash (+STR +DEX)",
            damage: function () {
                return (att.str + att.dex) * 2;
            },
            level_required: 15,
            odds: 10,
            cost: 0,
            emoji: "⚔️"
        },
        {
            skill_name: "Infinity Rampage (+STR)",
            damage: function () {
                return att.str * 20;
            },
            level_required: 1,
            odds: 1,
            cost: 0,
            emoji: "☠️"
        }
    ];
    return skills;
};

warrior.prototype.hpFormula = function () {
    let formula_hp = function (con, lvl) {
        return (con * 10) + lvl;
    };
    return formula_hp;
};

warrior.prototype.spFormula = function () {
    let formula_sp = function (int, wis, lvl) {
        return 0;
    };
    return formula_sp;
};

warrior.prototype.accuracyFormula = function () {
    let formula_acc = function (dex, lvl) {
        return (dex * 2) + lvl;
    };
    return formula_acc;
};

warrior.prototype.fleeFormula = function () {
    let formula_flee = function (agi, lvl) {
        return agi + lvl;
    };
    return formula_flee;
};

warrior.prototype.autoAttackFormula = function () {
    let formula_autoAttack = function (str, dex, agi, lvl) {
        return str + dex + agi + lvl;
    };
    return formula_autoAttack;
};


module.exports = function () {
    return warrior;
}
