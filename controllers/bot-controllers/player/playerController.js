const getItems = require('./inventory/getItemFunctions')
const testFunctions = require('./inventory/inventoryTestFunctions')
const equipItem = require('./inventory/equipItem')
const playerInfo = require('./player-routes/playerInfo')
const { levelup } = require('./stats/statsController')
const menus = require('../../../menus/menus')

const { buildPlayer } = require('../../../model/factories/player-factory')

const levelExp = require('../../../model/player/levelExp')

module.exports.playerControllerRoute = (bot) => {
    bot.command('me', playerInfo.me)
    bot.command('addItensToBag', testFunctions.addItensToBag)
    bot.command('equip', equipItem)
    bot.command('bags', getItems.getItens)
    bot.command('equipments', getItems.getEquipments)
    bot.command('levelup', levelup)
    bot.command('levelUp', (ctx) => ctx.reply('Pick a stat to levelup', menus.levelUpMenu))
    bot.command('back', (ctx) => ctx.reply('Main menu:', menus.mainMenu))

    bot.command('showCompleteStats', (ctx) => ctx.reply(buildPlayer(ctx.session.player, ctx.session.player.classe)))

    bot.command('addExp', async (ctx) => {
        await levelExp.addExp(ctx, 500)
        ctx.reply('500 added')
    })
}