pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFactory {
    event WrappedTokenCreated(address collateral, address wrappedToken);
    event ExchangeCreated(address collateral, address exchange);

    function create(IERC20 _token) external returns (bool);
    function wrappedTokens(address _token) external view returns (address);
    function exchanges(address _token) external view returns (address);
}
