// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";//to console outputcontract TokenMarketPlace is Ownable {using SafeERC20 for IERC20;

contract TokenMarketPlace is Ownable {
using SafeMath for uint256;   //x.add(y) = x+y
using SafeERC20 for IERC20;

uint256 public tokenPrice = 2e16 wei; // 0.02 ether per GLD token //2 * 10^16 
//10 * 0.02 = 0.2 ether

uint256 public sellerCount = 1;
uint256 public buyerCount=1;

IERC20 public gldToken;

event TokenPriceUpdated(uint256 newPrice);
event TokenBought(address indexed buyer, uint256 amount, uint256 totalCost);
event TokenSold(address indexed seller, uint256 amount, uint256 totalEarned);
event TokensWithdrawn(address indexed owner, uint256 amount);
event EtherWithdrawn(address indexed owner, uint256 amount);
event CalculateTokenPrice(uint256 priceToPay);

constructor(address _gldToken) Ownable(msg.sender){
  gldToken = IERC20(_gldToken);
}

// Updated logic for token price calculation with safeguards
function adjustTokenPriceBasedOnDemand() public {
   uint marketDemandRatio = buyerCount.mul(1e18).div(sellerCount); 
   uint smoothingFactor = 1e18;
   uint adjustedRatio = marketDemandRatio.add(smoothingFactor).div(2);
   uint newTokenPrice =  tokenPrice.mul(adjustedRatio).div(1e18);
   uint minimumPrice = 2e16;
   if(newTokenPrice<minimumPrice){
     tokenPrice = minimumPrice;
   }
   tokenPrice = newTokenPrice;
}

// Buy tokens from the marketplace
  function buyGLDToken(uint256 _amountOfToken) public payable {
    require(_amountOfToken>0,"Invalid Token amount");    uint requiredTokenPrice = calculateTokenPrice(_amountOfToken);

    require(requiredTokenPrice==msg.value,"Incorrect token price paid");
    // Transfer token to the buyer address
    gldToken.safeTransfer(msg.sender,_amountOfToken);
    buyerCount = buyerCount + 1 ; 
    // Event Emiting
    emit TokenBought(msg.sender, _amountOfToken, requiredTokenPrice);
  }
    function calculateTokenPrice(uint _amountOfToken) public returns(uint){
        require(_amountOfToken>0,"Amount Of Token > 0");
        adjustTokenPriceBasedOnDemand();
        uint amountToPay = _amountOfToken.mul(tokenPrice).div(1e18);
        console.log("amountToPay",amountToPay);
        return amountToPay;
    }
// Sell tokens back to the marketplace
function sellGLDToken(uint256 _amountOfToken) public { require(gldToken.balanceOf(msg.sender)>= _amountOfToken, "invalid amount of token");
 uint priceToPayToUser = calculateTokenPrice(_amountOfToken);
 gldToken.safeTransferFrom(msg.sender,address(this),_amountOfToken);
 (bool success,) = payable(msg.sender).call{value:priceToPayToUser}("");
 require(success,"Transaction Failed");
 emit TokenSold(msg.sender,_amountOfToken, priceToPayToUser);
  }
    // Owner can withdraw excess tokens from the contract
   function withdrawTokens(uint256 _amount) public onlyOwner {
     require(gldToken.balanceOf(address(this))>=_amount,"Out of balance");
     gldToken.safeTransfer(msg.sender,_amount);
     emit TokensWithdrawn(msg.sender, _amount);
   }// Owner can withdraw accumulated Ether from the contract

function withdrawEther(uint256 _amount) public onlyOwner {
    require(address(this).balance>=_amount,"Invalid Ether amount");
    (bool success,) = payable(msg.sender).call{value:_amount}("");
    require(success,"Transaction Failed");
}
}