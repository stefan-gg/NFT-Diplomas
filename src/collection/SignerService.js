import { Contract } from "ethers";
import abi from "./abi.json";

export default class CollectionService {
    constructor(signer) {
        this.contract = new Contract(
            "0x883fb0C00b0ec0C8d3f54457308349Be8dDbc545",
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
        return await this.contract.acceptDiploma(diplomaID);
    }

    async suspendDiploma(diplomaID, comment) {
        return await this.contract.suspendDiploma(diplomaID, comment);
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