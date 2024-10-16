// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract DiplomasContract {
    uint256 private count;
    uint256 private numOfUniversities;
    uint256 private adminCount;

    struct Diploma {
        uint256 diplomaID;
        bool isVerified;
        bool isSuspended;
        string universityName;
        string diplomaIPFSLink;
        string comment;
        address addedBy;
        address adminAddress;
    }

    struct ReturnData {
        bool isAdmin;
        bool isUniversityRepresentative;
        string[] universityNames;
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

    event DiplomaCreation(address indexed sender, uint256 diplomaID, uint256 timestamp);
    event DiplomaVerification(address indexed admin, uint256 diplomaID, bool isAccepted, uint256 timestamp);
    event AdminRoleAdministration(address indexed admin, address targetAddress, bool isRoleAdded, uint256 timestamp);
    event URRoleAdministration(address indexed admin, address targetAddress, bool isRoleAdded, uint256 timestamp);

    error InvalidAddress(address _address);

    constructor() {
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

    function addAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin != address(0)){
            require(admins[newAdmin] == false, "Admin already exists");
            require(universityRepresentatives[newAdmin] != true, "Address already has a role");
        }
        else revert InvalidAddress(newAdmin);

        admins[newAdmin] = true;
        emit AdminRoleAdministration(msg.sender, newAdmin, true, block.timestamp);
    }

    function removeAdmin(address removeAdminAddress) external onlyAdmin {
        if (removeAdminAddress != address(0))
            require(admins[removeAdminAddress] == true, "Admin doesn't exist");
        else revert InvalidAddress(removeAdminAddress);

        admins[removeAdminAddress] = false;
        emit AdminRoleAdministration(msg.sender, removeAdminAddress, false, block.timestamp);
    }

    function addUniversityRepresentative(address newUR) external onlyAdmin {
        if (newUR != address(0)){
            require(
                universityRepresentatives[newUR] == false,
                "UR already exists"
            );
            require(admins[newUR] != true, "Address already has a role");
        }
        else revert InvalidAddress(newUR);

        universityRepresentatives[newUR] = true;
        emit URRoleAdministration(msg.sender, newUR, true, block.timestamp);
    }

    function removeUniversityRepresentative(address ur) external onlyAdmin {
        if (ur != address(0))
            require(universityRepresentatives[ur] == true, "UR doesn't exist");
        else revert InvalidAddress(ur);

        universityRepresentatives[ur] = false;
        emit URRoleAdministration(msg.sender, ur, false, block.timestamp);
    }

    function addDiploma(
        string memory diplomaIPFSLink,
        string memory universityName
    ) external onlyUniversityRepresentative {
        require(bytes(diplomaIPFSLink).length >= 46, "Invalid IPFS link");
        require(bytes(universityName).length > 2 && bytes(universityName).length <= 100, "Invalid university name");

        Diploma memory newDiploma = Diploma(
            count,
            false,
            false,
            universityName,
            _setTokenURI(diplomaIPFSLink),
            "",
            msg.sender,
            address(0)
        );

        diplomas[count] = newDiploma;

        if (universityDiplomas[universityName].length == 0) {
            universityID[numOfUniversities] = universityName;
            numOfUniversities++;
        }

        universityDiplomas[universityName].push(count);

        emit DiplomaCreation(msg.sender, count, block.timestamp);

        count++;
    }

    function acceptDiploma(uint256 id) external onlyAdmin {
        require(
            diplomas[id].isVerified == false,
            "Diploma is already accepted"
        );
        require(id <= count, "DiplomaID is invalid");
        require(diplomas[id].isSuspended == false, "Diploma is suspended");

        diplomas[id].isVerified = true;
        diplomas[id].adminAddress = msg.sender;
        emit DiplomaVerification(msg.sender, id, true, block.timestamp);
    }

    function suspendDiploma(uint256 id, string memory comment)
        external
        onlyAdmin
    {
        require(
            id <= count, "Diploma ID is not valid"
        );

        diplomas[id].isVerified = false;
        diplomas[id].isSuspended = true;
        diplomas[id].comment = comment;
        diplomas[id].adminAddress = msg.sender;
        emit DiplomaVerification(msg.sender, id, false, block.timestamp);
    }

    function getDiplomaByID(uint256 diplomaID)
        external
        view
        returns (Diploma memory)
    {
        return diplomas[diplomaID];
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
                returnDiplomas[i - start] = diplomas[
                    universityDiplomas[universityName][i]
                ];
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

    modifier onlyAdmin() {
        if (!admins[msg.sender]) revert InvalidAddress(msg.sender);
        _;
    }

    modifier onlyUniversityRepresentative() {
        if (!universityRepresentatives[msg.sender])
            revert InvalidAddress(msg.sender);
        _;
    }
}
