import { Contract } from "ethers";
import abi from "./abi.json";
import { getMetadata } from "../service/IPFSService"

export default class CollectionService {
    constructor(provider) {
        this.contract = new Contract(
            "0x99FDAB56758D370887F91F1116981602b59cBBE6",
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
}