import { Contract } from 'ethers';
import abi from './abi.json';

export default class SignerService {
    constructor(signer) {
        this.contract = new Contract(
            '0x699aa2A82313e7e3edDc4a0b8DBcbc5aE2c56F1c',
            abi,
            signer
        );
    }

    async checkAddressRoles() {
        return await this.contract.checkAddressRoles();
    }

    async addDiploma(ipfsLink, universityName) {
        return await this.contract.addDiploma(ipfsLink, universityName);
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
