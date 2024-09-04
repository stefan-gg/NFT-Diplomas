import { Contract, parseEther } from "ethers";
import abi from "./abi.json";

export default class CollectionService {
    constructor(signer) {
        this.contract = new Contract(
            "0xcCa6B9258b7A0e50dC64D4cdCd1F9Afc8eaC8bA4",
            abi, 
            signer);
    }

    async getDiplomas() {
        const data = await this.contract.getDiplomas();
        return data;
    }

    async addDiploma(date, ipfsLink, universityName) {
        return await this.contract.addDiploma(date, ipfsLink, universityName);
    }
}