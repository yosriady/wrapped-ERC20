pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "./interfaces/IExchange.sol";
import "./interfaces/IERC20Metadata.sol";
import "./WrappedERC20.sol";
import "./WrappedERC20Exchange.sol";

contract WrappedERC20Factory {
  using SafeERC20 for IERC20;

  event WrappedTokenCreated(address originalToken, address wrappedToken, string symbol);
  event ExchangeCreated(address originalToken, address exchange, string symbol);
  event ExchangeInitialized(address exchange, address caller);

  mapping(address => WrappedERC20) public wrappedTokens; // Mapping of token address -> wrapped token address
  mapping(address => IExchange) public exchanges; // Mapping of token address -> exchange address

  function create(IERC20 _token) public {
    // Get name, symbol, and decimals directly from _token, via ERC20Detailed
    IERC20Metadata m = IERC20Metadata(address(_token));
    string memory wrappedName = string(abi.encodePacked("Wrapped", " ", m.name()));
    string memory wrappedSymbol = string(abi.encodePacked("w", m.symbol())); // e.g. wPAY

    // Deploy Wrapped Token contract
    WrappedERC20 wrappedToken = new WrappedERC20(
      wrappedName,
      wrappedSymbol,
      uint8(m.decimals()) // Conversion from old uint256 decimals to new uint8
    );
    wrappedTokens[address(_token)] = wrappedToken;
    emit WrappedTokenCreated(address(_token), address(wrappedToken), wrappedSymbol);

    // Deploy Token <> Wrapped Token Exchange contract
    IExchange exchange = new WrappedERC20Exchange(
      _token,
      wrappedToken
    );
    exchanges[address(_token)] = exchange;
    emit ExchangeCreated(address(_token), address(exchange), wrappedSymbol);

    // Handover ERC20Mintable mint permissions from deployer to Exchange contract
    MinterRole mintable = MinterRole(address(wrappedToken));
    mintable.addMinter(address(exchange));
    mintable.renounceMinter();

    emit ExchangeInitialized(address(exchange), msg.sender);
  }
}