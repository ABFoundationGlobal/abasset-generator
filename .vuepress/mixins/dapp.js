import config from "../config";
import TokenArtifact from "../abi/BaseToken.json";

export default {
  data() {
    return {
      legacy: false,
      web3: null,
      web3Provider: null,
      metamask: {
        installed: false,
        netId: null,
      },
      network: {
        default: config.defaultNetwork,
        current: null,
        map: {
          1007: "ABIoTTestNet",
          1012: "ABIoTMainNet",
          26888: "ABCoreTestNet",
          36888: "ABCoreMainNet",
        },
        list: {
          ABCoreTestNet: {
            web3Provider: "https://rpc.core.testnet.ab.org",
            etherscanLink: "https://explorer.core.testnet.ab.org/",
            id: "26888",
            name: "ABCoreTestNet",
          },
          ABCoreMainNet: {
            web3Provider: "https://rpc1.core.ab.org",
            etherscanLink: "https://explorer.core.ab.org/",
            id: "36888",
            name: "ABCoreMainNet",
          },
          ABIoTTestNet: {
            web3Provider: "https://rpc1.newchain.newtonproject.org",
            etherscanLink: "https://explorer.testnet.ab.org/",
            id: "1007",
            name: "ABIoTTestNet",
          },
          ABIoTMainNet: {
            web3Provider: "https://global.rpc.iot.ab.org",
            etherscanLink: "https://explorer.ab.org/",
            id: "1012",
            name: "ABIoTMainNet",
          },
        },
      },
      contracts: {
        token: null,
      },
    };
  },
  methods: {
    initWeb3(network, checkWeb3) {
      if (!this.network.list.hasOwnProperty(network)) {
        // eslint-disable-line no-prototype-builtins
        throw new Error(
          `Failed initializing network ${network}. Allowed values are ${Object.keys(
            this.network.list
          )}.`
        );
      }

      return new Promise((resolve) => {
        if (
          checkWeb3 &&
          (typeof window.ethereum !== "undefined" ||
            typeof window.web3 !== "undefined")
        ) {
          if (window.ethereum) {
            console.log("injected web3"); // eslint-disable-line no-console
            this.web3Provider = window.ethereum;
          } else if (window.abwallet?.ethereum) {
            console.log("injected web3(abwallet)");
            this.web3Provider = window.abwallet?.ethereum;
            this.legacy = true;
          } else {
            console.log("injected web3 (legacy)"); // eslint-disable-line no-console
            this.web3Provider = window.web3.currentProvider;
            this.legacy = true;
          }

          this.web3 = new Web3(this.web3Provider);
          this.metamask.installed = true;
          this.web3.version.getNetwork(async (err, netId) => {
            if (err) {
              console.log(err); // eslint-disable-line no-console
            }
            this.metamask.netId = netId;
            if (parseInt(netId) !== parseInt(this.network.list[network].id)) {
              this.network.current = this.network.list[this.network.map[netId]];
              await this.initWeb3(network, false);
            }
            resolve();
          });
        } else {
          console.log("provided web3"); // eslint-disable-line no-console
          this.network.current = this.network.list[network];
          this.web3Provider = new Web3.providers.HttpProvider(
            this.network.list[network].web3Provider
          );
          this.web3 = new Web3(this.web3Provider);

          resolve();
        }
      });
    },
    async switchNetwork() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: `0x${Number(this.network.current.id).toString(16)}` },
          ], // 转换为十六进制
        });
        // await this.initWeb3(this.currentNetwork, true);
        console.log(`成功切换到网络，chainId: ${this.network.current.id}`);
      } catch (switchError) {
        // 错误码 4902 表示网络未添加
        if (switchError.code === 4902) {
          try {
            // 可选：自动添加网络（需要提供完整网络信息）
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${Number(this.network.current.id).toString(16)}`,
                  chainName: this.network.current.name,
                  rpcUrls: [this.network.current.web3Provider],
                  nativeCurrency: {
                    name: "AB",
                    symbol: "AB",
                    decimals: 18,
                  },
                  blockExplorerUrls: [this.network.current.etherscanLink],
                },
              ],
            });
            // await this.initWeb3(this.currentNetwork, true);
          } catch (addError) {
            console.error("添加网络失败:", addError);
            // this.makeToast(
            //   'Warning',
            //   `Your Wallet in on the wrong network. Please switch on ${this.network.current.name} and try again! | 您的钱包处于错误的网络，请切换到${this.network.current.name}并重试。`,
            //   'warning',
            // );
            return;
          }
        } else {
          console.error("切换网络失败:", switchError);
          // this.makeToast(
          //   'Warning',
          //   `Your Wallet in on the wrong network. Please switch on ${this.network.current.name} and try again! | 您的钱包处于错误的网络，请切换到${this.network.current.name}并重试。`,
          //   'warning',
          // );
          return;
        }
      }
    },
    initToken() {
      this.contracts.token = this.web3.eth.contract(TokenArtifact.abi);
      this.contracts.token.contractName = TokenArtifact.contractName;
      this.contracts.token.compiler = TokenArtifact.compiler;
      this.contracts.token.bytecode = TokenArtifact.bytecode;
      this.contracts.token.devdoc = TokenArtifact.devdoc;
      this.contracts.token.stringifiedAbi = JSON.stringify(TokenArtifact.abi);
    },
  },
};
