function thief() {}

thief.prototype.getSkills = function () {
    var skills = [
        {
            skill_name: "Stab",
            damage: 6,
            level_required: 1,
            odds: 25,
            cost: 0,
            emoji: "🔪"
        },
        {
            skill_name: "Backstab",
            damage: 20,
            level_required: 1,
            odds: 10,
            cost: 0,
            emoji: "🔪"
        },
        {
            skill_name: "Shadow Step",
            damage: 20,
            level_required: 1,
            odds: 10,
            cost: 0,
            emoji: "👻"
        },
        {
            skill_name: "Cross Slash",
            damage: 40,
            level_required: 15,
            odds: 5,
            cost: 0,
            emoji: "⚔️"
        },
        {
            skill_name: "Curse: DEATH",
            damage: 200,
            level_required: 1,
            odds: 1,
            cost: 0,
            emoji: "😈"
        }
    ];
    return skills;
};

thief.prototype.hpFormula = function () {
    let formula_hp = function (con, lvl) {
        return (con * 10) + lvl;
    };
    return formula_hp;
};

thief.prototype.spFormula = function () {
    let formula_sp = function (int, wis, lvl) {
        return 0;
    };
    return formula_sp;
};

thief.prototype.accuracyFormula = function () {
    let formula_acc = function (dex, lvl) {
        return (dex * 2) + lvl;
    };
    return formula_acc;
};

thief.prototype.fleeFormula = function () {
    let formula_flee = function (agi, lvl) {
        return agi + lvl;
    };
    return formula_flee;
};

thief.prototype.autoAttackFormula = function () {
    let formula_autoAttack = function (str, dex, agi, lvl) {
        return str + dex + agi + lvl;
    };
    return formula_autoAttack;
};


module.exports = function () {
    return thief;
}
