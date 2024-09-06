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

        console.log(data);
        
        const diplomes = await Promise.all(
            data.map(async (diploma) => {
                const metadata = await getMetadata(diploma.diplomeIPFSLink);
                
                return {
                    ...diploma,
                    ...metadata,
                };
            })
        );
        return diplomes;
    }

}