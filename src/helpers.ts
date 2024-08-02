import {
  Chain,
  ChainAddress,
  ChainContext,
  Network,
  Signer,
  Wormhole,
  chainToPlatform,
  encoding,
} from "@wormhole-foundation/sdk";

import evm from "@wormhole-foundation/sdk/platforms/evm";
import solana from "@wormhole-foundation/sdk/platforms/solana";

export interface SignerStuff<N extends Network, C extends Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

const DEVNET_SOL_PRIVATE_KEY = encoding.b58.encode(
  new Uint8Array([
    35, 177, 161, 178, 43, 189, 109, 201, 191, 48, 219, 97, 41, 41, 147, 242,
    137, 194, 111, 130, 77, 195, 150, 101, 105, 20, 14, 232, 104, 87, 246, 223,
    74, 227, 45, 53, 22, 65, 248, 209, 249, 82, 132, 93, 20, 227, 79, 198, 72,
    210, 180, 220, 88, 113, 73, 55, 151, 170, 221, 158, 221, 101, 182, 200,
  ])
);
const DEVNET_ETH_PRIVATE_KEY =
  "0x9881355ae4f0bfb07459265beedc6f7cb8f38e2674c2dc4f79b3eb79165ab8fc"; // Ganache default private key

//   sepolia: 'https://eth-sepolia.g.alchemy.com/v2/9JvMr2pkUzaf92ilWFG4zcEpgNJGBNor',
//   solana: 'https://thrumming-dry-uranium.solana-devnet.quiknode.pro/52f6e84f05fdd03c0a7672070aabd56f35cdf587/',

const SOLANA_DEVNET_RPC =
  "https://thrumming-dry-uranium.solana-devnet.quiknode.pro/52f6e84f05fdd03c0a7672070aabd56f35cdf587";
const SEPOLIA_DEVNET_RPC =
  "https://eth-sepolia.g.alchemy.com/v2/9JvMr2pkUzaf92ilWFG4zcEpgNJGBNor";

export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>
): Promise<SignerStuff<N, C>> {
  // Read in from `.env`
  const rpc = await chain.getRpc();
  console.log(`rpc: ${rpc}`);
  let signer: Signer;
  const platform = chainToPlatform(chain.chain);
  switch (platform) {
    case "Solana":
      signer = await solana.getSigner(
        SOLANA_DEVNET_RPC,
        DEVNET_SOL_PRIVATE_KEY,
        { debug: false }
      );
      break;
    case "Evm":
      signer = await evm.getSigner(SEPOLIA_DEVNET_RPC, DEVNET_ETH_PRIVATE_KEY, {
        debug: false,
      });
      break;
    default:
      throw new Error("Unrecognized platform: " + platform);
  }

  return {
    chain,
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}