pragma solidity 0.5.11;

interface IPAYToken {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);

    function transfer(address _to, uint256 _value) external;
    function approve(address _spender, uint256 _value) external;
    function transferFrom(address _from, address _to, uint256 _value) external;
    function mint(address _to, uint256 _amount) external returns (bool);
    function balanceOf(address _owner) external view returns (uint256);
    function allowance(address _owner, address _spender) external view returns (uint256);
}
