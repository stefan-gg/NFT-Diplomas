import { Contract } from "ethers";
import abi from "./abi.json";

export default class CollectionService {
    constructor(signer) {
        this.contract = new Contract(
            "0x99FDAB56758D370887F91F1116981602b59cBBE6",
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