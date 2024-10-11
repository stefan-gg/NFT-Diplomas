// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract DiplomasContract {
    uint256 private count;
    uint256 private numOfUniversities;
    uint256 private adminCount;
    address private owner;

    struct Diploma {
        uint256 diplomaID;
        string diplomaDate;
        bool isVerified;
        bool isSuspended;
        string universityName;
        string diplomaIPFSLink;
        string comment;
    }

    struct ReturnData {
        bool isAdmin;
        bool isUniversityRepresentative;
        string[] universityNames;
        // imena fakulteta
        // uint256 numOfDiplomas;
        // Diploma[] diplomas;
    }

    struct PaginationData {
        uint256 numOfDiplomas;
        Diploma[] diplomas;
    }

    mapping(address => bool) private admins;
    mapping(address => bool) private universityRepresentatives;
    mapping(uint256 => Diploma) private diplomas;

    mapping(uint256 => string) private universityID;
    mapping(string => uint256[]) universityDiplomas;

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    function _setTokenURI(string memory cid)
        internal
        pure
        returns (string memory)
    {
        bytes memory bytesStr1 = bytes("https://ipfs.filebase.io/ipfs/");
        bytes memory bytesStr2 = bytes(cid);
        bytes memory result = new bytes(bytesStr1.length + bytesStr2.length);

        for (uint256 i = 0; i < bytesStr1.length; i++) {
            result[i] = bytesStr1[i];
        }

        for (uint256 j = 0; j < bytesStr2.length; j++) {
            result[bytesStr1.length + j] = bytesStr2[j];
        }

        return string(result);
    }

    // ************************************************************** revert InvalidValue(_value);
    function addAdmin(address newAdmin) external onlyAdmin {
        admins[newAdmin] = true;
    }

    function removeAdmin(address removeAdminAddress) external onlyAdmin {
        require(admins[removeAdminAddress] == true, "Admin doesn't exist");
        admins[removeAdminAddress] = false;
    }

    function addUniversityRepresentative(address newUR) external onlyAdmin {
        universityRepresentatives[newUR] = true;
    }

    function removeUniversityRepresentative(address ur) external onlyAdmin {
        require(universityRepresentatives[ur] == true, "UR doesn't exist");
        universityRepresentatives[ur] = false;
    }

    function addDiploma(
        string memory date,
        string memory diplomaIPFSLink,
        string memory universityName
    ) external onlyUniversityRepresentative {
        Diploma memory newDiploma = Diploma(
            count,
            date,
            false,
            false,
            universityName,
            _setTokenURI(diplomaIPFSLink),
            ""
        );

        diplomas[count] = newDiploma;

        if (universityDiplomas[universityName].length == 0) {
            universityID[numOfUniversities] = universityName;
            numOfUniversities++;
        }

        universityDiplomas[universityName].push(count);

        count++;
    }

    function acceptDiploma(uint256 id) external onlyAdmin {
        require(
            diplomas[id].isVerified == false,
            "Diploma is already accepted"
        );
        require(id <= count, "DiplomaID is invalid");

        diplomas[id].isVerified = true;
    }

    function suspendDiploma(uint256 id, string memory comment)
        external
        onlyAdmin
    {
        // require(
        //     diplomas[id].isVerified == true,
        //     "Diploma is not accepted"
        // );
        diplomas[id].isVerified = false;
        diplomas[id].isSuspended = true;
        // if (bytes(comment).length > 5){
        diplomas[id].comment = comment;
        // }
    }

    function getDiplomaByID(uint256 diplomaID)
        external
        view
        returns (Diploma memory)
    {
        //require da se doda da se proveri dal postoji diploma mozda
        return diplomas[diplomaID];
    }

    function getDiplomas() external view returns (Diploma[] memory) {
        Diploma[] memory diplomasArray = new Diploma[](count);

        for (uint256 i = 0; i < count; i++) {
            diplomasArray[i] = diplomas[i];
        }

        return diplomasArray;
    }

    function getDiplomasWithPagination(
        uint256 pageNumber,
        string memory universityName
    ) external view returns (PaginationData memory) {
        Diploma[] memory returnDiplomas;

        uint256 universityNameLength = bytes(universityName).length;
        uint256 pageSize = 6;

        uint256 size = universityNameLength > 0
            ? universityDiplomas[universityName].length
            : count;
        uint256 start = pageNumber > 0 ? (pageNumber - 1) * pageSize : 0;
        uint256 end = pageNumber > 0 ? pageNumber * pageSize : pageSize;

        if (start > size) {
            returnDiplomas = new Diploma[](0);
            return PaginationData(0, returnDiplomas);
        }

        if (end > size) {
            end = size;
        }

        returnDiplomas = new Diploma[](end - start);

        for (uint256 i = start; i < end; i++) {
            if (i >= size) break;
            if (universityNameLength > 0) {
                returnDiplomas[i - start] = diplomas[universityDiplomas[universityName][i]];
            } else {
                returnDiplomas[i - start] = diplomas[i];
            }
        }

        return PaginationData(size, returnDiplomas);
    }

    function checkAddressRoles() external view returns (ReturnData memory) {
        string[] memory _universityNames = new string[](numOfUniversities);

        for (uint256 i = 0; i < numOfUniversities; i++) {
            _universityNames[i] = universityID[i];
        }

        ReturnData memory data = ReturnData({
            isAdmin: admins[msg.sender],
            isUniversityRepresentative: universityRepresentatives[msg.sender],
            universityNames: _universityNames
        });

        return data;
    }

    // modifier onlyOwner() {
    //     require(msg.sender == owner);
    //     _;
    // }

    modifier onlyAdmin() {
        require(admins[msg.sender] == true);
        _;
    }

    modifier onlyUniversityRepresentative() {
        require(universityRepresentatives[msg.sender] == true);
        _;
    }
}
