pragma solidity 0.5.11;

interface IERC20MintableBurnable {
    function mint(address account, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
}
