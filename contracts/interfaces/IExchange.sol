pragma solidity 0.5.11;

interface IExchange {
    event Deposited(address payee, uint256 amount);
    event Withdrawn(address payee, uint256 amount);

    function deposit(uint256 _amount) external returns (bool);
    function withdraw(uint256 _amount) external returns (bool);
    function token() external view returns (address);
    function wrappedToken() external view returns (address);
}
