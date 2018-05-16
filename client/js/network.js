class Network {
	constructor(addr) {
		this.addr = addr;
		this.sock = new WebSocker(addr);
	}
}