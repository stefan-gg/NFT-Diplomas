import { Contract } from 'ethers';
import abi from './abi.json';

export default class CollectionService {
    constructor(signer) {
        this.contract = new Contract(
            // "0xD6146bDdA150695cFfedEFB53b191B334F7Fd230",
            '0x75f08388f9b1e409b79ad7591144C9dF73b7A316',
            abi,
            signer
        );
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

    async getLogs(address) {
        const adminFilter = this.contract.filters.AdminRoleAdministration(address);
        const adminRoleEvents = await this.contract.queryFilter(
            adminFilter,
            0,
            'latest'
        );

        const urFilter = this.contract.filters.URRoleAdministration(address);
        const urRoleEvents = await this.contract.queryFilter(urFilter, 0, 'latest');

        const diplomaCreationFilter =
            this.contract.filters.DiplomaCreation(address);
        const diplomaCreationEvents = await this.contract.queryFilter(
            diplomaCreationFilter,
            0,
            'latest'
        );

        const diplomaVerificationFilter =
            this.contract.filters.DiplomaVerification(address);
        const diplomaVerificationEvents = await this.contract.queryFilter(
            diplomaVerificationFilter,
            0,
            'latest'
        );

        // console.log(addedEvents.length, events.length);
        // console.log(events[0].args, events[0].eventName);

        console.log([
            ...adminRoleEvents,
            ...urRoleEvents,
            ...diplomaCreationEvents,
            ...diplomaVerificationEvents,
        ]);

        return [
            ...adminRoleEvents,
            ...urRoleEvents,
            ...diplomaCreationEvents,
            ...diplomaVerificationEvents,
        ];
    }
}
