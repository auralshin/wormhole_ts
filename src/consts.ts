import { Chain } from "@wormhole-foundation/sdk-base";
import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { NttRoute } from "@wormhole-foundation/sdk-route-ntt";
export type NttContracts = {
  [key in Chain]?: Ntt.Contracts;
};

export const TEST_NTT_SPL22_TOKENS: NttContracts = {
  Sepolia: {
    token: "0x550c374680E9375998f064F8d34c860591630491",
    manager: "0x7838a8dE75FD0BEbc5DAc3fF90991d36923e6C15",
    transceiver: {
      wormhole: "0x2AE696131CCC40b634eE663652768d2F87A73473",
    },
  },
  Solana: {
    token: "5Bx2hkzdvGAB8Ro6PwkrMLjj84yi4dAK8TMacm7yER4d",
    manager: "NTtkunSrRbR4bqQfRviUqhPeuXwzA15zqukxnqcBTn2",
    transceiver: { wormhole: "DeCqdmHwieyJANceeJTjTLXSTUiPpAAoE5t4tfMwDPcP" },
  },
};

// Reformat NTT contracts to fit TokenConfig for Route
// function reformat(contracts: NttContracts) {
//   return Object.entries(TEST_NTT_TOKENS).map(([chain, contracts]) => {
//     const { token, manager, transceiver: xcvrs, quoter } = contracts!;
//     const transceiver = Object.entries(xcvrs).map(([k, v]) => {
//       return { type: k as NttRoute.TransceiverType, address: v };
//     });
//     return { chain: chain as Chain, token, manager, quoter, transceiver };
//   });
// }

// export const NttTokens = {
//   Test: reformat(TEST_NTT_TOKENS),
// };
