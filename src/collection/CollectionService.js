import { Contract } from "ethers";
import abi from "./abi.json";
import { getMetadata } from "../service/IPFSService"

export default class CollectionService {
    constructor(provider) {
        this.contract = new Contract(
            "0x289a62152115468d982Ea64505E523f159C2C03B",
            abi,
            provider);
    }

    async getDiplomaByID(diplomaID) {

        const data = [await this.contract.getDiplomaByID(diplomaID)];

        // We check if the University name exists,
        // if it is emptyString then there is no diploma with the diplomaID
        // that matches diplomaID from the search input.
        if (data[0].universityName === '') {
            return {...data};
        }

        const diploma = await Promise.all(
            data.map(async (diploma) => {

                const metadata = await getMetadata(diploma.diplomaIPFSLink);

                return {
                    ...diploma,
                    ...metadata,
                };
            })
        );
        return diploma;
    }

    async getDiplomasWithPagination(pageNumber, universityName) {
        const data = await this.contract.getDiplomasWithPagination(pageNumber, universityName);

        if (Number(data[0]) === 0) {
            return {...data};
        }

        const diplomas = await Promise.all(
            data[1].map(async (diploma) => {
                const metadata = await getMetadata(diploma.diplomaIPFSLink);

                return {
                    numberOfDiplomas: data[0],
                    ...diploma,
                    ...metadata,
                };
            })
        );
        
        return diplomas;
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

        return [
            ...adminRoleEvents,
            ...urRoleEvents,
            ...diplomaCreationEvents,
            ...diplomaVerificationEvents,
        ];
    }
}