pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "./interfaces/IERC20Detailed.sol";
import "./interfaces/IERC20MintableBurnable.sol";
import "./interfaces/IExchange.sol";
import "./interfaces/IFactory.sol";
import "./WrappedERC20Exchange.sol";
import "./WrappedERC20.sol";

contract WrappedERC20Factory is IFactory {
    using SafeERC20 for IERC20;

    event WrappedTokenCreated(address collateral, address wrappedToken);
    event ExchangeCreated(address collateral, address exchange);

    mapping(IERC20 => IERC20MintableBurnable) public wrappedTokens; // Mapping of token address -> wrapped token address
    mapping(IERC20 => IExchange) public exchanges; // Mapping of token address -> exchange address

    /**
    * @dev Deploys a new WrappedERC20 token and automated Exchange contract for a given ERC20 token.
    * @param _token ERC20 token address e.g. PAY token
    */
    function create(IERC20 _token) public returns (bool) {
        IERC20MintableBurnable wrappedToken = createWrappedToken(_token);
        IExchange exchange = createExchange(_token, wrappedToken);

        // Handover ERC20Mintable mint permissions from deployer to Exchange contract
        MinterRole mintable = MinterRole(address(wrappedToken));
        mintable.addMinter(address(exchange));
        mintable.renounceMinter();

        return true;
    }

    /**
    * @dev Deploys a new WrappedERC20 token for a given ERC20 token.
    * @param _token ERC20 token address e.g. PAY token
    * @return IERC20MintableBurnable wrapped token address
    */
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

    /**
    * @dev Deploys an automated Exchange contract for a given pair of ERC20 and WrappedERC20 tokens.
    * @param _token ERC20 token address e.g. PAY token
    * @param _wrappedToken Wrapped ERC20 token address e.g. wPAY token
    * @return IExchange exchange address
    */
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