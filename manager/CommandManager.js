const fs = require("fs");
const path = require("path")
const Group = require("../Base/Group");

class CommandManager {
	constructor() {
		this.commands = []
		this.groups = new Map()
	}

	/**
	 * @description register command
	 * @param command command to register
	 */
	register(command) {
		if(Array.isArray(command)) command.forEach(cmd => this.register(cmd));

		this.commands.push(command)

		if(command?.group?.length > 0) {
			let group = this.groups.get(command?.group)
			if(!group) {
				group = new Group(command?.group)
				this.groups.set(command.group, group)
			}
			group.register(command)
		}
	}

	/**
	 * @description Register commands in folder
	 * @param {String} folderPath Path to folder
	 * @example commandHandler.commands.loadCommands("./commands")
	 */
	async loadCommands(folderPath) {
		if (typeof folderPath !== "string")
			throw new TypeError(`folderPath must be string, received ${typeof folderPath}`)

		await fs.readdirSync(folderPath)
		.filter(f => f.endsWith(".js"))
		.forEach(f => this.register(new (require(path.resolve("./", `${folderPath}${folderPath.endsWith("/") ? "" : "/"}${f}`)))()))
	}

	/**
	 * @description return command by name or alias
	 * @param name command's name or alias
	 * @return boolean
	 */
	get(name) {
		return this.commands.find((c) => c?.name === name.toLowerCase() || c?.alias?.includes(name.toLowerCase()))
	}

	getGroup(x) {
		return this.groups.get(x)
	}
}

module.exports = CommandManager