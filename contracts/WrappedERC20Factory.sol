pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "./interfaces/IERC20Detailed.sol";
import "./interfaces/IERC20MintableBurnable.sol";
import "./interfaces/IExchange.sol";
import "./WrappedERC20Exchange.sol";
import "./WrappedERC20.sol";

contract WrappedERC20Factory {
    using SafeERC20 for IERC20;

    event WrappedTokenCreated(address collateral, address wrappedToken);
    event ExchangeCreated(address collateral, address exchange);

    mapping(address => IERC20MintableBurnable) public wrappedTokens; // Mapping of token address -> wrapped token address
    mapping(address => IExchange) public exchanges; // Mapping of token address -> exchange address

    // Deploys WrappedERC20 and Exchange contract
    function create(IERC20 _token) public {
        IERC20MintableBurnable wrappedToken = createWrappedToken(_token);
        IExchange exchange = createExchange(_token, wrappedToken);

        // Handover ERC20Mintable mint permissions from deployer to Exchange contract
        MinterRole mintable = MinterRole(address(wrappedToken));
        mintable.addMinter(address(exchange));
        mintable.renounceMinter();
    }

    // Deploy Wrapped Token contract
    function createWrappedToken(IERC20 _token) internal returns (IERC20MintableBurnable) {
        // Get name, symbol, and decimals directly from _token, via ERC20Detailed
        IERC20Detailed t = IERC20Detailed(address(_token));
        string memory wrappedName = string(abi.encodePacked("Wrapped", " ", t.name()));
        string memory wrappedSymbol = string(abi.encodePacked("w", t.symbol())); // e.g. wPAY
        uint8 wrappedDecimals = uint8(t.decimals()); // Conversion from old ERC20 uint256 decimals to new uint8

        IERC20MintableBurnable wrappedToken = new WrappedERC20(
          wrappedName,
          wrappedSymbol,
          wrappedDecimals
        );
        wrappedTokens[address(_token)] = wrappedToken;
        emit WrappedTokenCreated(address(_token), address(wrappedToken));

        return wrappedToken;
    }

    // Deploy Token <> Wrapped Token Exchange contract
    function createExchange(IERC20 _token, IERC20MintableBurnable _wrappedToken) internal returns (IExchange) {
        IExchange exchange = new WrappedERC20Exchange(
          _token,
          _wrappedToken
        );
        exchanges[address(_token)] = exchange;
        emit ExchangeCreated(address(_token), address(exchange));

        return exchange;
    }
}