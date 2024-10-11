import { Contract } from "ethers";
import abi from "./abi.json";
import { getMetadata } from "../service/IPFSService"

export default class CollectionService {
    constructor(provider) {
        this.contract = new Contract(
            // "0xD6146bDdA150695cFfedEFB53b191B334F7Fd230",
            "0x75f08388f9b1e409b79ad7591144C9dF73b7A316",
            abi,
            provider);
    }

    async getDiplomas() {
        const data = await this.contract.getDiplomas();

        const diplomas = await Promise.all(
            data.map(async (diploma) => {
                const metadata = await getMetadata(diploma.diplomaIPFSLink);

                return {
                    ...diploma,
                    ...metadata,
                };
            })
        );
        return diplomas;
    }

    async getDiplomaByID(diplomaID) {

        const data = [await this.contract.getDiplomaByID(diplomaID)];

        // We check if the University name exists,
        // if it is then there is no diploma with the diplomaID
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
}