import { Province } from 'kingdom/Province';

export class Kingdom {

	provincesMap: { [roomName: string]: string };
	Provinces: { [roomName: string]: Province };

	constructor() {
		this.provincesMap = {};
		this.Provinces = {};
	}

	registerProvinces = () =>  {
		for(const name in Game.rooms) {
			const controller = Game.rooms[name].controller;
			if (controller !== undefined && controller.my) {
				this.provincesMap[name] = name;
				this.Provinces[name] = new Province(name);
			}
		}
	}

	init = () => {
		this.registerProvinces();
	}

	run = () => {
		for (const name in this.Provinces) {
			const start = Game.cpu.getUsed();
			this.Provinces[name].run();
			console.log(`cpu.usage.${name}.run`, Game.cpu.getUsed() - start);
		}
	}
}
