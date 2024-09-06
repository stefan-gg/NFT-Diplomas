import { Contract } from "ethers";
import abi from "./abi.json";

export default class CollectionService {
    constructor(signer) {
        this.contract = new Contract(
            "0x88363a1bFe49F325567b4fC7c9998c0093EC72f9",
            abi, 
            signer);
    }

    async checkAddressRoles() {
        return await this.contract.checkAddressRoles();
    }

    async addDiploma(date, ipfsLink, universityName) {
        return await this.contract.addDiploma(date, ipfsLink, universityName);
    }
}