<template>
  <div>
    <b-jumbotron
      text-variant="white"
      header="ABAsset Generator"
      lead="Create your Token for FREE | 自由的发行通证"
      class="mb-0"
      fluid
    >
      <!--            <p>-->
      <!--                <b-img src="https://img.shields.io/badge/version-3.0.4-blue"></b-img>-->
      <!--                <b-link href="https://travis-ci.org/github/vittominacori/erc20-generator" target="_blank">-->
      <!--                    <b-img src="https://travis-ci.org/vittominacori/erc20-generator.svg?branch=master"></b-img>-->
      <!--                </b-link>-->
      <!--                <b-link href="https://coveralls.io/github/vittominacori/erc20-generator" target="_blank">-->
      <!--                    <b-img src="https://coveralls.io/repos/github/vittominacori/erc20-generator/badge.svg?branch=master"></b-img>-->
      <!--                </b-link>-->
      <!--            </p>-->
      <p>
        Easily deploy Smart Contract for a Standard, Capped, Mintable, Burnable
        NewAsset Token.
      </p>
      <p>轻松部署标准的、可增发和销毁、可以设置封顶额度的NewAsset通证</p>
      <hr class="my-4" />
      <a
        class="btn btn-lg btn-outline-light"
        href="#token-generator"
        v-smooth-scroll="{ duration: 1000, offset: -50, updateHistory: false }"
      >
        Create a Token | 创建通证
      </a>
      <!--            <b-button to="/docs.html" size="lg" variant="light">-->
      <!--                Documentation-->
      <!--            </b-button>-->
    </b-jumbotron>
    <b-row>
      <b-col lg="10" offset-lg="1" class="mb-3 p-0">
        <b-card v-if="!loading" bg-variant="transparent" border-variant="0">
          <b-alert show class="alert-box text-white">
            NOTE: to use this app we suggest to install
            <a
              href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              target="_blank"
              class="text-warning"
              >MetaMask</a
            >
            extension on Firefox. Use any other wallet at your own risk. <br />
            提示：建议<a
              href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              target="_blank"
              class="text-warning"
              >MetaMask</a
            >插件钱包来使用此App发行Token。
          </b-alert>

          <b-card
            header="Making transaction... | 正在发起交易"
            header-bg-variant="info"
            header-text-variant="white"
            v-if="makingTransaction || transactionStarted"
            class="mt-3"
          >
            <div class="text-white" v-if="!trxHash">
              Please wait... | 请稍等
            </div>
            <div v-else>
              <b>Well! Transaction done! | 交易执行完毕</b><br />
              Transaction id | 交易ID
              <a :href="trxLink" target="_blank"
                ><span v-html="trxHash"></span></a
              ><br />

              Retrieving Token. | 正在获取通证地址。
              <div v-if="!token.address">Please wait...</div>
              <div v-else>
                <b>Your Token | 您的通证地址 </b>
                <b-link :href="token.link" target="_blank"
                  ><span v-html="token.address"></span
                ></b-link>
              </div>
            </div>
          </b-card>

          <ValidationObserver
            id="token-generator"
            ref="observer"
            tag="form"
            @submit.prevent="generateToken()"
            v-if="!makingTransaction"
          >
            <fieldset :disabled="formDisabled">
              <b-row>
                <b-col lg="4">
                  <b-card
                    header="Token Details | 通证详情"
                    header-bg-variant="dark"
                    header-text-variant="white"
                    class="mt-3"
                  >
                    <ValidationProvider
                      class="text-blue"
                      name="token name"
                      :rules="{ required: true }"
                      v-slot="{ errors }"
                    >
                      <b-form-group
                        description="Choose a name for your token. | 为您的通证选一个名字。"
                        label="Token name * | 通证名称"
                        label-for="tokenName"
                      >
                        <b-form-input
                          id="tokenName"
                          name="tokenName"
                          placeholder=""
                          v-model.trim="token.name"
                          size="lg"
                          :class="{ 'is-invalid': errors.length > 0 }"
                          maxlength="20"
                        >
                        </b-form-input>
                        <small v-show="errors.length > 0" class="text-danger">
                          {{ errors[0] }}
                        </small>
                      </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider
                      name="token symbol"
                      :rules="{ required: true }"
                      v-slot="{ errors }"
                    >
                      <b-form-group
                        description="Choose a symbol for your token (usually 3-5 chars). | 通证符号一般是3-5个英文字符。"
                        label="Token symbol * | 通证符号"
                        label-for="tokenSymbol"
                      >
                        <b-form-input
                          id="tokenSymbol"
                          name="tokenSymbol"
                          placeholder=""
                          v-model.trim="token.symbol"
                          size="lg"
                          :class="{ 'is-invalid': errors.length > 0 }"
                          maxlength="5"
                        >
                        </b-form-input>
                        <small v-show="errors.length > 0" class="text-danger">
                          {{ errors[0] }}
                        </small>
                      </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider
                      name="token decimals"
                      :rules="{
                        required: true,
                        numeric: true,
                        min_value: 0,
                        max_value: 36,
                      }"
                      v-slot="{ errors }"
                    >
                      <b-form-group
                        description="Insert the decimal precision of your token. If you don't know what to insert, use 18. | 如果没有特殊需求，就可以写18。"
                        label="Token decimals * | 通证小数位数"
                        label-for="tokenDecimals"
                      >
                        <b-form-input
                          id="tokenDecimals"
                          name="tokenDecimals"
                          placeholder="Your token decimals"
                          type="number"
                          v-model.trim="token.decimals"
                          size="lg"
                          :class="{ 'is-invalid': errors.length > 0 }"
                          step="1"
                        >
                        </b-form-input>
                        <small v-show="errors.length > 0" class="text-danger">
                          {{ errors[0] }}
                        </small>
                      </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider
                      name="token max supply"
                      :rules="{
                        required: true,
                        numeric: true,
                        min_value: 1,
                        max_value: 1000000000000000,
                      }"
                      v-slot="{ errors }"
                    >
                      <b-form-group
                        description="Insert the maximum number of tokens available. | 填写通证的最大发行数量。"
                        label="Total supply * | 总发行量"
                        label-for="tokenCap"
                      >
                        <b-form-input
                          id="tokenCap"
                          name="tokenCap"
                          placeholder=""
                          type="number"
                          v-model.trim="token.cap"
                          size="lg"
                          v-on:update="updateInitialBalance"
                          :class="{ 'is-invalid': errors.length > 0 }"
                          step="1"
                        >
                        </b-form-input>
                        <small v-show="errors.length > 0" class="text-danger">
                          {{ errors[0] }}
                        </small>
                      </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider
                      name="token initial supply"
                      :rules="{
                        required: true,
                        numeric: true,
                        min_value: 0,
                        max_value: token.cap || 0,
                      }"
                      v-slot="{ errors }"
                    >
                      <b-form-group
                        description="Insert the initial number of tokens available. Will be put in your account. | 填写通证的初始发行量，这些Token会放到当前钱包账户。"
                        label="Initial supply * | 初始发行量"
                        label-for="tokenInitialBalance"
                      >
                        <b-form-input
                          id="tokenInitialBalance"
                          name="tokenInitialBalance"
                          placeholder=""
                          type="number"
                          :disabled="finishMinting"
                          v-model.trim="token.initialBalance"
                          size="lg"
                          :class="{ 'is-invalid': errors.length > 0 }"
                          step="1"
                        >
                        </b-form-input>
                        <small v-show="errors.length > 0" class="text-danger">
                          {{ errors[0] }}
                        </small>
                      </b-form-group>
                    </ValidationProvider>
                  </b-card>
                </b-col>
                <b-col lg="8">
                  <b-card
                    header="Advanced | 高级选项"
                    header-bg-variant="dark"
                    header-text-variant="white"
                    class="mt-3"
                  >
                    <b-row>
                      <b-col lg="12">
                        <b-form-group
                          description="Choose your Network. | 选择发行通证的网络"
                          label="Network * | 网络"
                          label-for="network"
                        >
                          <b-form-select
                            id="network"
                            v-model="currentNetwork"
                            size="lg"
                            @input="initDapp"
                          >
                            <option v-for="(n, k) in network.list" :value="k">
                              {{ n.name }}
                            </option>
                          </b-form-select>
                        </b-form-group>

                        <!-- <b-alert show variant="warning" v-if="currentNetwork !== 'NewChainMainNet'"> -->
                        <b-alert
                          show
                          variant="primary"
                          v-if="
                            currentNetwork.toLowerCase().includes('testnet')
                          "
                        >
                          <strong>
                            You selected a TEST Network. | 您选择了测试网。
                          </strong>
                        </b-alert>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col lg="12">
                        <b-form-group
                          description="Choose to enable transfer during deploy or enable manually later. | 您可以选择在部署时就开启转账功能，或者稍后手工开启。"
                          label-for="enableTransfer"
                        >
                          <b-form-checkbox
                            class="text-white"
                            v-model="enableTransfer"
                            size="lg"
                            switch
                          >
                            Enable transfer | 开启转账功能
                          </b-form-checkbox>
                        </b-form-group>

                        <b-alert show variant="warning" v-if="!enableTransfer">
                          <strong>
                            Tokens won't be transferable until you call the
                            <i>enableTransfer</i> function. <br />
                            只有您手工调用<i>enableTransfer</i>方法，通证才可以转账交易。
                          </strong>
                          <hr />
                          Only people (or smart contracts) with
                          <i>OPERATOR</i> role will be able to transfer
                          tokens.<br />
                          Contract creator will be OPERATOR by default, so he
                          can transfer tokens also when transfer is not
                          enabled.<br />
                          You can also add or remove the OPERATOR role to
                          addresses.<br />
                          This is because, by business choices, you may decide
                          not to enable transfer until a specific time.<br />
                          只有具有<i>OPERATOR</i>角色的人能够转账。<br />
                          此合约的创建者默认具有<i>OPERATOR</i>角色，所以他可以进行转账。<br />
                          您也可以对此合约增加或删除<i>OPERATOR</i>角色。<br />
                          您可以根据商业策略，决定在特定时间之前关闭转账功能。<br />
                        </b-alert>
                        <b-alert show variant="info" v-if="enableTransfer">
                          <strong>
                            Everyone will be able to transfer tokens after
                            deploy. <br />
                            在发行完毕后，任何人都可以进行转账。
                          </strong>
                          <hr />
                          If you decide not to enable transfer until a specific
                          time, disable this option and call the
                          <i>enableTransfer</i> function manually later. <br />
                          如果您决定在特定的时间之前关闭转账，则可以关闭此选项，并在将来手工调用<i>enableTransfer</i>方法。
                        </b-alert>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col lg="12">
                        <b-form-group
                          description="Choose to disable minting during deploy or disable manually later. | 选择现在关闭增发功能，或者将来手工关闭。"
                          label-for="finishMinting"
                        >
                          <b-form-checkbox
                            class="text-white"
                            v-model="finishMinting"
                            size="lg"
                            v-on:input="updateInitialBalance"
                            switch
                          >
                            Disable minting | 关闭增发功能
                          </b-form-checkbox>
                        </b-form-group>

                        <b-alert show variant="warning" v-if="finishMinting">
                          <strong>
                            You won't be able to generate other tokens.<br />
                            您将无法对此Token进行增发。
                          </strong>
                          <hr />
                          Your initial supply will be equal to total supply.<br />
                          您的初始发行量会等于总发行量。
                        </b-alert>
                        <b-alert show variant="info" v-if="!finishMinting">
                          <strong>
                            You will be able to generate tokens up to your total
                            supply.<br />
                            您可以增发Token，直到达到最大发行量。
                          </strong>
                          <hr />
                          You can add or remove the MINTER role to addresses.<br />
                          When you decide to disable minting you must call the
                          <i>finishMinting</i> function manually.
                          <p />

                          您可以为当前Token增加或者删除MINTER角色。<br />
                          当您决定取消增发功能时，您必须手工调用<i>finishMinting</i>方法。
                          <p />
                        </b-alert>
                      </b-col>
                    </b-row>
                  </b-card>

                  <b-row class="mt-3">
                    <b-col lg="12" class="text-right">
                      <b-button variant="primary" size="lg" type="submit"
                        >Create Token | 创建通证</b-button
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </fieldset>
          </ValidationObserver>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import dapp from "../mixins/dapp";
import utils from "../mixins/utils";

export default {
  name: "Generator",
  mixins: [dapp, utils],
  data() {
    return {
      loading: true,
      currentNetwork: null,
      trxHash: "",
      transactionStarted: false,
      makingTransaction: false,
      formDisabled: false,
      token: {
        name: "",
        symbol: "",
        decimals: 18,
        cap: "",
        initialBalance: "",
      },
      enableTransfer: true,
      finishMinting: false,
    };
  },
  mounted() {
    this.currentNetwork = this.getParam("network") || this.network.default;
    this.initDapp();
  },
  methods: {
    async initDapp() {
      this.network.current = this.network.list[this.currentNetwork];
      try {
        await this.initWeb3(this.currentNetwork, true);
        this.initToken();
        this.loading = false;
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
        this.makeToast("Some errors occurred", e, "danger");
        // document.location.href = this.$withBase('/');
      }
    },
    async generateToken() {
      this.$refs.observer
        .validate()
        .then(async (result) => {
          if (result) {
            if (!this.metamask.installed) {
              this.makeToast(
                "Warning",
                "To create a Token please install NewMask! | 您必须安装NewMask！",
                "danger"
              );
              return;
            } else {
              await new Promise((resolve) => {
                new Web3(
                  window.ethereum || window.web3.currentProvider
                ).version.getNetwork(async (err, netId) => {
                  if (err) {
                    console.log(err); // eslint-disable-line no-console
                  }
                  if (parseInt(netId) !== parseInt(this.network.current.id)) {
                    await this.switchNetwork();
                    await this.initWeb3(this.currentNetwork, true);
                    this.initToken();
                  }
                  resolve();
                });
              });
            }

            const name = this.token.name;
            const symbol = this.token.symbol.toUpperCase();
            const decimals = new this.web3.BigNumber(this.token.decimals);
            const cap = new this.web3.BigNumber(this.token.cap).mul(
              Math.pow(10, this.token.decimals)
            );
            const initialBalance = new this.web3.BigNumber(
              this.token.initialBalance
            ).mul(Math.pow(10, this.token.decimals)); // eslint-disable-line max-len
            const enableTransfer = this.enableTransfer;
            const finishMinting = this.finishMinting;

            try {
              this.trxHash = "";
              this.formDisabled = true;
              this.makingTransaction = true;

              if (!this.legacy) {
                await this.web3Provider.enable();
              }

              setTimeout(() => {
                this.contracts.token.new(
                  name,
                  symbol,
                  decimals,
                  cap,
                  initialBalance,
                  enableTransfer,
                  finishMinting,
                  {
                    from: this.web3.eth.coinbase,
                    data: this.contracts.token.bytecode,
                  },
                  (e, tokenContract) => {
                    if (e) {
                      this.makingTransaction = false;
                      this.formDisabled = false;
                      this.makeToast(
                        "Some error occurred",
                        e.message,
                        "danger"
                      );
                    } else {
                      // NOTE: The callback will fire twice!
                      // Once the contract has the transactionHash property
                      // set and once its deployed on an address.
                      if (!tokenContract.address) {
                        this.transactionStarted = true;
                        this.trxHash = tokenContract.transactionHash;
                        this.trxLink =
                          this.network.current.etherscanLink +
                          "/tx/" +
                          this.trxHash;
                        if (this.isMobile()) {
                          const that = this;
                          var interval;
                          var getTransactionReceipt = function () {
                            window.web3.eth.getTransactionReceipt(
                              tokenContract.transactionHash,
                              function (e, receipt) {
                                if (receipt && receipt.blockHash) {
                                  if (interval) {
                                    clearInterval(interval);
                                  }
                                  if (!that.token.address) {
                                    that.token.address =
                                      receipt.contractAddress;
                                    that.token.link =
                                      that.network.current.etherscanLink +
                                      "/token/" +
                                      that.token.address;
                                    that.$forceUpdate();
                                    that.makeToast(
                                      "Well done! | 太好了！",
                                      `Your tasdoken has been deployed at | 您的通证部署在 ${that.token.address}`,
                                      "success | 成功"
                                    );
                                  }
                                }
                              }
                            );
                          };
                          interval = setInterval(getTransactionReceipt, 3000);
                        }
                      } else {
                        this.token.address = tokenContract.address;
                        this.token.link =
                          this.network.current.etherscanLink +
                          "/token/" +
                          this.token.address;
                        this.$forceUpdate();
                        this.makeToast(
                          "Well done! | 太好了！",
                          `Your token has been deployed at | 您的通证部署在 ${this.token.address}`,
                          "success | 成功"
                        );
                      }
                    }
                  }
                );
              }, 500);
            } catch (e) {
              this.makingTransaction = false;
              this.formDisabled = false;
              this.makeToast("Some error occurred", e.message, "danger");
            }
          }
        })
        .catch((e) => {
          console.log(e); // eslint-disable-line no-console
          this.makingTransaction = false;
          this.makeToast("Some error occurred", e.message, "danger");
        });
    },

    updateInitialBalance() {
      this.token.initialBalance = this.finishMinting
        ? this.token.cap
        : this.token.initialBalance;
    },
    getParam(param) {
      const vars = {};
      window.location.href.replace(location.hash, "").replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) {
          // callback
          vars[key] = value !== undefined ? value : "";
        }
      );

      if (param) {
        return vars[param] ? vars[param] : null;
      }
      return vars;
    },
  },
};
</script>
