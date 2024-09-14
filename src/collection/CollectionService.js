import { Contract } from "ethers";
import abi from "./abi.json";
import { getMetadata } from "../service/IPFSService"

export default class CollectionService {
    constructor(provider) {
        this.contract = new Contract(
            "0x88363a1bFe49F325567b4fC7c9998c0093EC72f9",
            abi, 
            provider);
    }

    async getDiplomas() {
        // const data = await this.contract.getDiplomas();
        // return data;
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
        const data = await this.contract.getDiplomaByID(diplomaID);

        const diplomas = await Promise.all(
            data.map(async (diploma) => {

                if (diploma.univeristyName != '') {
                    const metadata = await getMetadata(diploma.diplomaIPFSLink);
                    
                    return {
                        ...diploma,
                        ...metadata,
                    };
                } else {
                    diploma
                }

            })
        );
        return diplomas;
    }

}