pragma solidity 0.5.10;


interface IExchange {
    // TODO: events, getters
    function deposit(uint256 _amount) external;
    function withdraw(uint256 _amount) external;
}