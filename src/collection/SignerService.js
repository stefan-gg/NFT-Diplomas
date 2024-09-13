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

    async acceptDiploma(diplomaID) {
        return await this.contract.acceptDiplome(diplomaID);
    }

    async suspendDiploma(diplomaID, comment) {
        return await this.contract.suspendDiplome(diplomaID, comment);
    }

    async addAdmin(address) {
        return await this.contract.addAdmin(address);
    }

    async removeAdmin(address) {
        return await this.contract.removeAdmin(address);
    }

    async addUniversityRepresentative(address) {
        return await this.contract.addUniversityRepresentative(address);
    }

    async removeUniversityRepresentative(address) {
        return await this.contract.removeUniversityRepresentative(address);
    }

}