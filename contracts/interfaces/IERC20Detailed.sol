pragma solidity 0.5.11;

interface IERC20Detailed {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint256);
}
