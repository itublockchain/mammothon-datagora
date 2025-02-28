<<<<<<< HEAD
![datagora](./public/banner.jpg)
=======
![datagora](./project_images/datagora_banner.jpeg)
>>>>>>> datagora-backend/main

# Getting Started

<p><b>Datagora</b> is a cutting-edge decentralized application (dApp) on the Movement Network, utilizing the <b>$DATA</b> token for efficient data exchanges. The name "<b>Datagora</b>" marries "Data" from English with "Agora," the ancient Greek term for a marketplace. It provides a powerful platform for researchers, companies, and independent developers—known as "<b>campaign creators</b>"—to launch data collection campaigns specifically for <b>AI training.</b> Whether the need is for health metrics, shopping receipts, or browsing behaviors, creators can specify data requirements and set quality standards. Participants contributing their data earn <b>$DATA</b> tokens, promoting a dynamic ecosystem. <b>Datagora</b> emphasizes data authenticity, privacy, and applies rigorous verification to ensure high-quality data, building trust among creators and contributors alike.</p>

- ### Documents: [Datagora Docs](https://docs.datagora.xyz/)
- ### Live Demo: [datagora.xyz](https://datagora.xyz/)

<<<<<<< HEAD
## How to run the Datagora frontend project:

### 1. Clone the repository.

```bash
git clone https://github.com/itublockchain/datagora-front.git <local-folder-name>
```

### 2. Install dependencies.

```bash
npm install
```

### 3. Set the environment variables.

- Create a `.env` file in the root of the project.
- Copy the variables from `.env.example` to `.env` and set them according to your needs.

## [Development]

#### If you want to run the project in development mode, you can use the following command:

### 4. Run the project in development mode.

```bash
npm run dev
```

## [Production]

#### If you want to build the project, you can use the following command:

### 4. Build the project.

```bash
npm run build
```

### 5. Run the project.

```bash
npm run start
```

## Additional Notes:

- You can use [example contribution data](https://ipfs.io/ipfs/bafkreieh5ki5tqtf62pnxfm3fjaf25j3nl3rhukru4plukpn3o6kbkhpjm) for testing projects.
=======
## How to run the Datagora backend project:

1. Install dependencies: `npm install`
2. Install Movement CLI: [Official Movement CLI Setup Guide](https://docs.movementnetwork.xyz/devs/movementcli)
3. Initialize movement account in two separate module folder.

   - sources/data: `movement init --skip-faucet`
   - sources/marketplace: `movement init --skip-faucet`
   - for both, you will do the same process:

     - select network as "custom" and then press enter.
     - after that, movement cli will request rest url, write the url which you want to use.
       we recommend using bardock testnet for testing. `https://aptos.testnet.bardock.movementlabs.xyz/v1`
     - then you will get private key, public key, account address in both .movement folder, please rename network from "Custom" to "Testnet".

     ***

   on sources/data:

   - Use `movement move init --name Data` command to initialize the project.
   - In Move.toml file, add the following to the [addresses] section:

     ```toml
     [addresses]
     data = "account_address_in_the_.movement_folder"
     ```

   on sources/marketplace:

   - Use `movement move init --name Marketplace` command to initialize the project.
   - In Move.toml file, add the following to the [addresses] and [dependencies] section:

   ```toml
    [addresses]
    marketplace = "account_address_in_the_.movement_folder"

    [dependencies]
    AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", rev = "mainnet", subdir = "aptos-move/framework/aptos-framework"}
    Data = {local = "../data"}
   ```

   Afterall your folders in sources, should look like this:

   ![Third process](./project_images/third_process.png)

4. Create .env file using .env.example file:

   - In that file you should fill it like this.

   ```env
   NODE_URL=https://aptos.testnet.bardock.movementlabs.xyz/v1
   FAUCET_URL=https://fund.testnet.bardock.movementlabs.xyz/

   ACCOUNT_PRIVATE_KEY=(your_any_movement_account_private_key)

   MODULE_PRIVATE_KEY=(marketplace_module_private_key)
   MODULE_ADDRESS=(marketplace_module_address)

   TOKEN_MODULE_PRIVATE_KEY=(token_module_private_key)
   TOKEN_MODULE_ADDRESS=(token_module_address)

   TEST=(choose true or false)
   ```

5. Use `npm start` to interact with the modules or deploy it to the network.
   -If it works properly, you should see the following output:

   ![Fifth process](./project_images/fifth_process.png)

6. You can use publish command to publish the module to the network.

- We need $MOVE for both DATA and MARKETPLACE module addresses.
- To cover this, we recommend to use "https://faucet.movementnetwork.xyz/?network=bardock"
- Before publishing the modules you must publish the DATA module first.
- Then, you can publish the MARKETPLACE module. Because the MARKETPLACE module belongs to DATA module and its address.

## Additional Notes:

- Marketplace module is using $DATA as its native token. So you need to have some $DATA in your account to interact with the module.
- You can have $DATA from the $DATA faucet.
- You must have add the "trusted public key" before initializing the create campaign function. It can be any secure account that YOU only have the access to it. We recommend using the marketplace module account for this.
>>>>>>> datagora-backend/main
