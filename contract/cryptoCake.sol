pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoCake is ERC721 {

    event newCake(address owner, uint16 recipe, string message, uint price);
    

    uint constant recipeDigits = 16;
    uint constant recipeModulus = 10 ** recipeDigits;

    struct Slice {
        uint8 index;
        string message;
        uint16 recipe;
        uint value;
        bool eaten;
        address baker;
    }

    Slice[] public slices;

    mapping (uint => address) public sliceToOwner;
    mapping (address => uint) ownerSliceCount;
    mapping (uint16 => address) recipeToBaker;
    
    constructor() ERC721("CryptoCake", "CCK") {}
    
    function _createCake(string memory _message, uint16 _recipe, uint _value) internal {
        
        for (uint8 i = 0; i < 16; i++){
            Slice memory newSlice = Slice(i, _message, _recipe, _value, false, msg.sender);
            slices.push(newSlice);
            uint id = slices.length - 1;
            sliceToOwner[id] = msg.sender;
            ownerSliceCount[msg.sender]++;
        }
        
        newCake(msg.sender, _recipe, _message, _value * 16);
        
    }

    function _generateRandomRecipe() private view returns (uint16) {
        
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp * 1000, msg.sender)));
        return uint16(rand % recipeModulus);
        
    }

    function bakeCake(string memory _message) public payable {
        
        require(msg.sender.balance >= msg.value, "Seu saldo e insuficiente para realizar esta operacaoo");
	    require(msg.value >= 0.1 ether, "Valor insuficiente para assar um bolo. O valor minimo e 0.1 ether");
	    
	    
	    uint tax = msg.value / 10;
	    uint sliceValue = (msg.value - tax) / 16;
	    
        uint16 randRecipe = 0;
        
        while(randRecipe == 0){
           uint16 rand = _generateRandomRecipe();
           
           if (recipeToBaker[rand] == address(0)){
               randRecipe = rand;
               recipeToBaker[randRecipe] = msg.sender;
           }
           
        }
        
        _createCake(_message, randRecipe, sliceValue);
    }
    
    function balanceOf(address _owner) public override view returns (uint256 _balance) {
        return ownerSliceCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public override view returns (address _owner) {
        return sliceToOwner[_tokenId];
    }
    
    function _transferCake(address _from, address _to, uint256 _tokenId) private {
        ownerSliceCount[_to]++;
        ownerSliceCount[_from]--;
        sliceToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
    }

    function sendCake(address _to, uint256 _tokenId) public {
        require(msg.sender == sliceToOwner[_tokenId], "A fatia informada nao e sua. Escolha uma que voce possui");
        require(slices[_tokenId].eaten == false, "Nao se pode transferir fatias ja comidas");
        _transferCake(msg.sender, _to, _tokenId);
    }
    
    function eatCake(uint256 _tokenId) public payable {
        require(msg.sender == sliceToOwner[_tokenId], "A fatia informada nao e sua. Escolha uma que voce possui");
        require(slices[_tokenId].eaten == false, "A fatia ja foi comida");
        
        address payable owner = payable (msg.sender);
        owner.transfer(slices[_tokenId].value);
        
        slices[_tokenId].eaten = true;
        
    }
    
    function slicesOfOwner(address _owner) public view returns(uint256[] memory ownerTokens) {
        
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalSlices = slices.length;
            uint256 resultIndex = 0;

            
            uint256 slicesId;

            for (slicesId = 0; slicesId <= totalSlices; slicesId++) {
                if (sliceToOwner[slicesId] == _owner) {
                    result[resultIndex] = slicesId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}