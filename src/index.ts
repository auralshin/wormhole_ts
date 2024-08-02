import { TransactionId, amount, signSendWait } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/platforms/evm";
import solana from "@wormhole-foundation/sdk/platforms/solana";

// register protocol implementations
import "@wormhole-foundation/sdk-evm-ntt";
import "@wormhole-foundation/sdk-solana-ntt";

import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { NttRoute } from "@wormhole-foundation/sdk-route-ntt";

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

export interface SignerStuff<N extends Network, C extends Chain> {
    chain: ChainContext<N, C>;
    signer: Signer<N, C>;
    address: ChainAddress<C>;
}

const DEVNET_SOL_PRIVATE_KEY = encoding.b58.encode(
    new Uint8Array([])
);
const DEVNET_ETH_PRIVATE_KEY = KEY_ETH; // Ganache default private key

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
    (await import("dotenv")).config();

    let signer: Signer;
    const platform = chainToPlatform(chain.chain);
    switch (platform) {
        case "Solana":
            signer = await solana.getSigner(
                await chain.getRpc(),
                getEnv("SOL_PRIVATE_KEY", DEVNET_SOL_PRIVATE_KEY),
                { debug: false }
            );
            break;
        case "Evm":
            signer = await evm.getSigner(
                await chain.getRpc(),
                getEnv("ETH_PRIVATE_KEY", DEVNET_ETH_PRIVATE_KEY)
            );
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

function getEnv(key: string, dev?: string): string {
    // If we're in the browser, return empty string
    if (typeof process === undefined) return "";
    // Otherwise, return the env var or error
    const val = process.env[key];
    if (!val) {
        if (dev) return dev;
        throw new Error(
            `Missing env var ${key}, did you forget to set values in '.env'?`
        );
    }

    return val;
}


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

// EVM 1.0.0, Solana 1.0.0
//   const TOKEN_CONTRACTS = TEST_NTT_TOKENS;
// EVM 1.0.0 Solana 2.0.0
const TOKEN_CONTRACTS = TEST_NTT_SPL22_TOKENS;

// Recover an in-flight transfer by setting txids here from output of previous run
const recoverTxids: TransactionId[] = [
    //{ chain: "Solana", txid: "hZXRs9TEvMWnSAzcgmrEuHsq1C5rbcompy63vkJ2SrXv4a7u6ZBEaJAkBMXKAfScCooDNhN36Jt4PMcDhN8yGjP", },
    //{ chain: "Sepolia", txid: "0x7c60e520f807593d27702427666e5c72aa282a3f14fe59ec934c5f9de9558609", },
    // Unused and staged
    //{chain: "Sepolia", txid: "0x1aff02ed4bf9d51a424626187e3e331304229fc0d422b7abfe8025452b166180"}
    {
        chain: "Sepolia",
        txid: "0xbcfabc279ce7aa6162cd6a8037dae258fd0cfe7959b9a82210a40d1ecdf52a4d",
    },
];

const vaaid =
    "10002/0000000000000000000000002ae696131ccc40b634ee663652768d2f87a73473/2";

// (async function () {
//   const wh = new Wormhole("Testnet", [solana.Platform, evm.Platform]);
//   const src = wh.getChain("Sepolia");
//   const dst = wh.getChain("Solana");

//   const srcSigner = await getSigner(src);
//   const dstSigner = await getSigner(dst);

//   const srcNtt = await src.getProtocol("Ntt", {
//     ntt: TOKEN_CONTRACTS[src.chain],
//   });
//   const dstNtt = await dst.getProtocol("Ntt", {
//     ntt: TOKEN_CONTRACTS[dst.chain],
//   });

//   // const amt = amount.units(
//   //   amount.parse("10", await srcNtt.getTokenDecimals())
//   // );

//   // const xfer = () =>
//   //   srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
//   //     queue: false,
//   //     automatic: false,
//   //     gasDropoff: BigInt(0),
//   //   });

//   // // Initiate the transfer (or set to recoverTxids to complete transfer)
//   // const txids: TransactionId[] =
//   //   recoverTxids.length === 0
//   //     ? await signSendWait(src, xfer(), srcSigner.signer)
//   //     : recoverTxids;
//   // console.log("Source txs", txids);

//   // const vaa = await wh.getVaa(
//   //   txids[0]!.txid,
//   //   "Ntt:WormholeTransfer",
//   //   25 * 60 * 1000
//   // );
//   // console.log(vaa);
//   console.log(dstSigner.address.address);
//   const dstTxids = await signSendWait(
//     dst,
//     dstNtt.redeem([vaaid!], dstSigner.address.address),
//     dstSigner.signer
//   );
//   console.log("dstTxids", dstTxids);
// })();

async function main() {
    const wh = new Wormhole("Testnet", [solana.Platform, evm.Platform]);
    const src = wh.getChain("Sepolia");
    const dst = wh.getChain("Solana");

    const srcSigner = await getSigner(src);
    const dstSigner = await getSigner(dst);

    const srcNtt = await src.getProtocol("Ntt", {
        ntt: TOKEN_CONTRACTS[src.chain],
    });
    const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TOKEN_CONTRACTS[dst.chain],
    });

    const amt = amount.units(
        amount.parse("10", await srcNtt.getTokenDecimals())
    );

    const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
            queue: false,
            automatic: false,
            gasDropoff: BigInt(0),
        });

    // Initiate the transfer (or set to recoverTxids to complete transfer)
    const txids: TransactionId[] =
        recoverTxids.length === 0
            ? await signSendWait(src, xfer(), srcSigner.signer)
            : recoverTxids;
    console.log("Source txs", txids);

    const vaa = await wh.getVaa(
        txids[0]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
    );
    console.log(vaa);
    console.log(dstSigner.address.address);
    const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
    );
    console.log("dstTxids", dstTxids);
}

main()
    .then(() => {
        console.log("done");
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
