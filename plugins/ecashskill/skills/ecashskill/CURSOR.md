# Cursor Rules for eCash Development

This file contains `.cursorrules` configurations for eCash development in Cursor.

## chronik-client

```yaml
- name: "chronik-client"
  description: "eCash Chronik Indexer API client configuration"
  files:
    - "**/*chronik*"
    - "**/wallet/**/*.ts"
    - "**/blockchain/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { ChronikClient, ConnectionStrategy } from 'chronik-client';

    - type: "best-practice"
      statement: |
        // Recommended to use ConnectionStrategy.ClosestFirst for auto-selecting optimal node
        const chronik = await ChronikClient.useStrategy(
          ConnectionStrategy.ClosestFirst,
          ['https://chronik.e.cash/xec']
        );

    - type: "error-handling"
      statement: |
        // Handle chronik connection errors
        try {
          const tx = await chronik.tx(txid);
        } catch (error) {
          if (error.message.includes('Not Found')) {
            console.error('Transaction not found:', txid);
          } else if (error.message.includes('timeout')) {
            console.error('Chronik request timeout');
          }
        }

    - type: "websocket"
      statement: |
        // Remember to handle disconnection and reconnection after WebSocket subscription
        const ws = chronik.ws({
          onMessage: handleMessage,
          onReconnect: (e) => console.log('Reconnecting...'),
          autoReconnect: true,
          keepAlive: true,
        });
```

**AI Role Settings:**
```
When writing code involving chronik-client:
1. Use ConnectionStrategy.ClosestFirst as default connection strategy
2. WebSocket subscriptions always set autoReconnect: true and keepAlive: true
3. Query methods return Promise, remember to use async/await
4. After transaction broadcasting, recommend using broadcastAndFinalizeTx to wait for confirmation
5. Use convenience method chronik.address() for address queries instead of script()
```

---

## ecash-wallet

```yaml
- name: "ecash-wallet"
  description: "eCash HD wallet library"
  files:
    - "**/*wallet*"
    - "**/*ecash*wallet*"
  rules:
    - type: "import"
      statement: |
        import { Wallet, WatchOnlyWallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';

    - type: "initialization"
      statement: |
        // Wallet initialization flow
        const chronik = new ChronikClient(['https://chronik.e.cash/xec']);
        const wallet = Wallet.fromMnemonic(mnemonic, chronik);
        await wallet.sync(); // Sync UTXOs and balance

    - type: "hd-wallet"
      statement: |
        // HD wallet configuration
        const hdWallet = Wallet.fromMnemonic(mnemonic, chronik, {
          hd: true,
          accountNumber: 0,
          receiveIndex: 0,
          changeIndex: 0,
        });

    - type: "best-practice"
      statement: |
        // Never store private keys in frontend
        // Use wallet signing instead of directly manipulating private keys
        // Call wallet.sync() after each send to update UTXOs

    - type: "balance"
      statement: |
        // Balance is BigInt
        console.log(wallet.balanceSats); // 1000000n
```

**AI Role Settings:**
```
When using ecash-wallet:
1. Always sync() wallet first before getting balance
2. Use BigInt for amounts (n suffix)
3. Need to re-sync() after sending to update UTXOs
4. WatchOnlyWallet cannot sign, only query
5. HD wallet uses BIP44 derivation path
6. Use with chronik-client
```

---

## ecash-lib

```yaml
- name: "ecash-lib"
  description: "eCash transaction building and signing library"
  files:
    - "**/*wallet*"
    - "**/*tx*"
    - "**/*sign*"
    - "**/*ecash*"
  rules:
    - type: "import"
      statement: |
        import {
          Ecc,
          P2PKHSignatory,
          Script,
          TxBuilder,
          Tx,
          Address,
          fromHex,
          toHex,
          shaRmd160,
          sha256,
          hash256,
          ALL_BIP143,
          SINGLE_BIP143,
          NONE_BIP143,
        } from 'ecash-lib';

    - type: "best-practice"
      statement: |
        // Use BIP143 signing (eCash recommended)
        // ALL_BIP143 = SIGHASH_ALL | SIGHASH_BIP143
        // SINGLE_BIP143 = SIGHASH_SINGLE | SIGHASH_BIP143
        // NONE_BIP143 = SIGHASH_NONE | SIGHASH_BIP143

    - type: "bigint"
      statement: |
        // Note: eCash uses bigint for satoshi amounts
        // Use BigInt() literals: 1000n, 546n
        // Do not use Number() as it has precision issues

    - type: "error-handling"
      statement: |
        // Signing error handling
        try {
          const tx = txBuilder.sign({ feePerKb: 1000n, dustSats: 546n });
        } catch (error) {
          if (error.message.includes('Insufficient funds')) {
            throw new Error('Insufficient balance to pay fee');
          }
          throw error;
        }

    - type: "key-management"
      statement: |
        // Private key handling best practices
        // 1. Never hardcode private keys in code
        // 2. Use environment variables or key management service
        // 3. Use mock private keys in test environment
```

**AI Role Settings:**
```
When writing code involving ecash-lib:
1. Use BigInt for amounts (n suffix), e.g., 1000n satoshis
2. Always use BIP143 signing (ALL_BIP143)
3. Use named exports for imports: import { Ecc, Script } from 'ecash-lib'
4. Never hardcode private keys, use environment variables
5. TxBuilder.sign() returns a Tx object, call .ser() to get raw transaction
6. Script.bytecode is Uint8Array, use toHex() to convert
7. Recommended to use with chronik-client to monitor UTXO changes
```

---

## ecashaddrjs

```yaml
- name: "ecashaddrjs"
  description: "eCash address format encoding/decoding"
  files:
    - "**/*address*"
    - "**/utils/**/*.ts"
    - "**/validation/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import ecashaddr from 'ecashaddrjs';

    - type: "best-practice"
      statement: |
        // Must validate type and hash after address decoding
        const { prefix, type, hash } = ecashaddr.decode(address);
        if (type !== 'P2PKH' && type !== 'P2SH') {
          throw new Error('Unsupported address type');
        }

    - type: "validation"
      statement: |
        // Validation function template
        function isValidEcashAddress(address: string): boolean {
          try {
            const { prefix } = ecashaddr.decode(address);
            return prefix === 'ecash';
          } catch {
            return false;
          }
        }

    - type: "conversion"
      statement: |
        // Address format conversion
        function convertAddressPrefix(address: string, newPrefix: string): string {
          const { type, hash } = ecashaddr.decode(address);
          return ecashaddr.encode(newPrefix, type, hash);
        }
```

**AI Role Settings:**
```
When writing code involving ecashaddrjs:
1. Always catch exceptions when using decode() to handle invalid addresses
2. decode() requires address with prefix (bitcoincash:, ecash:, etc.)
3. hash returned is Uint8Array, not Buffer
4. Supported type only has 'P2PKH' and 'P2SH'
5. Recommended prefix: 'ecash' (mainnet), 'ectest' (testnet)
```

---

## ecash-agora

```yaml
- name: "ecash-agora"
  description: "eCash Agora decentralized trading protocol"
  files:
    - "**/*agora*"
    - "**/*exchange*"
    - "**/*marketplace*"
  rules:
    - type: "import"
      statement: |
        import { Agora, AgoraPartial, AgoraOneshot } from 'ecash-agora';
        import { Wallet } from 'ecash-wallet';
        import { ChronikClient } from 'chronik-client';

    - type: "oneshot"
      statement: |
        // Oneshot for NFT - all or nothing
        const oneshot = new AgoraOneshot({
          enforcedOutputs: [...],
          cancelPk: makerCancelPk,
        });

    - type: "partial"
      statement: |
        // Partial for fungible Tokens - can purchase partially
        const partial = AgoraPartial.approximateParams({
          offeredAtoms: amount,
          priceNanoSatsPerAtom: price,
          minAcceptedAtoms: minAmount,
          tokenId,
          tokenType,
          tokenProtocol: 'SLP' | 'ALP',
        });

    - type: "accept"
      statement: |
        // Calculate fees when accepting offer
        const satsCost = offer.askedSats(acceptedAtoms);
        const fee = offer.acceptFeeSats({ ... });

    - type: "error-handling"
      statement: |
        // Agora error handling
        // - Invalid covenant: Offer has been modified
        // - Offer expired: Offer has expired or been cancelled
        // - Insufficient funds: Insufficient XEC for payment
```

**AI Role Settings:**
```
When using ecash-agora:
1. Oneshot for NFT (all or nothing)
2. Partial for fungible Tokens (can purchase partially)
3. acceptTx requires fuelInputs to pay fees
4. Price unit is nano sats per atom
5. Cancel offer uses cancelSk, not covenantSk
6. Validate transaction before broadcasting
```

---

## cashtab-connect

```yaml
- name: "cashtab-connect"
  description: "Cashtab browser extension wallet connection"
  files:
    - "**/*cashtab*"
    - "**/*wallet*connect*"
    - "**/dapp/**/*.ts"
  rules:
    - type: "import"
      statement: |
        import { CashtabConnect } from 'cashtab-connect';
        import {
          CashtabExtensionUnavailableError,
          CashtabAddressDeniedError,
          CashtabTransactionDeniedError,
          CashtabTimeoutError,
        } from 'cashtab-connect';

    - type: "initialization"
      statement: |
        // Initialize CashtabConnect
        const cashtab = new CashtabConnect({
          timeout: 30000,
          extensionNotAvailableMessage: 'Please install Cashtab wallet',
          addressDeniedMessage: 'User denied address request',
        });

    - type: "error-handling"
      statement: |
        // Error handling pattern
        try {
          const address = await cashtab.requestAddress();
        } catch (error) {
          if (error instanceof CashtabExtensionUnavailableError) {
            // Guide user to install extension
          } else if (error instanceof CashtabAddressDeniedError) {
            // User denied
          } else if (error instanceof CashtabTimeoutError) {
            // Timeout
          }
        }

    - type: "cleanup"
      statement: |
        // Cleanup on component unmount
        useEffect(() => {
          return () => cashtab.destroy();
        }, []);
```

**AI Role Settings:**
```
When using cashtab-connect:
1. Call waitForExtension() first to ensure extension is available
2. Use isExtensionAvailable() for pre-check
3. Amount parameter can be string or number
4. Always handle four error types
5. Call destroy() on component unmount
6. Do not hardcode timeout in production environment
```

---

## cashtab

```yaml
- name: "cashtab"
  description: "Cashtab eCash wallet reference implementation"
  files:
    - "**/*wallet*"
    - "**/*cashtab*"
    - "**/useWallet*"
    - "**/cashMethods*"
  rules:
    - type: "dependencies"
      statement: |
        # Core libraries used by Cashtab
        - bcash (forked): Transaction building and signing
        - ecashaddrjs: Address encoding/decoding
        - localforage: IndexedDB storage
        - bignumber.js: Precision calculation

    - type: "derivation-paths"
      statement: |
        # BIP44 Derivation Paths
        - Path245: m/44'/245'/0'/0/0 (main)
        - Path145: m/44'/145'/0'/0/0
        - Path1899: m/44'/1899'/0'/0/0 (eCash)

    - type: "address-types"
      statement: |
        # Supported address formats
        - cashAddress: ecash:q...
        - slpAddress: simpleledger:q...
        - legacyAddress: 1... or 3...
        - etokenAddress: etoken:q...

    - type: "bip70"
      statement: |
        # BIP70 payment protocol support
        - Use b70 library for PaymentDetails
        - Support Simple Ledger Payment Protocol

    - type: "storage"
      statement: |
        # Storage strategy
        - Prefer localforage (IndexedDB)
        - Fallback to localStorage
        - Encrypted wallet storage

    - type: "state-management"
      statement: |
        # React Context pattern
        - WalletContext: Wallet state
        - AuthenticationContext: Authentication state
        - useWallet hook for state access
```

**AI Role Settings:**
```
When referencing Cashtab to implement eCash features:
1. Use React Context for global state management
2. BIP44 derivation path uses Path1899 (coin type 1899)
3. Address conversion uses ecashaddrjs
4. Amount calculation uses bignumber.js to avoid precision issues
5. SLP Token uses OP_RETURN encoding
6. Prefer IndexedDB (localforage) for storage
7. Browser extension uses chrome.storage
```

---

## mock-chronik-client

```yaml
- name: "mock-chronik-client"
  description: "Chronik test mocking library"
  files:
    - "**/*.test.ts"
    - "**/*.spec.ts"
    - "**/__tests__/**"
  rules:
    - type: "import"
      statement: |
        import { MockChronikClient } from 'mock-chronik-client';
        import { MockAgora } from 'mock-chronik-client';

    - type: "setup"
      statement: |
        // Setup mock before test
        beforeEach(() => {
          mockChronik = new MockChronikClient();
          mockChronik.setChronikInfo({ version: '1.0.0' });
          mockChronik.setBlockchainInfo({ tipHeight: 800000 });
        });

    - type: "mock-data"
      statement: |
        // Mock common data
        mockChronik.setTx(txid, mockTransaction);
        mockChronik.setUtxosByAddress(address, [mockUtxo]);
        mockChronik.setToken(tokenId, mockTokenInfo);

    - type: "error-mock"
      statement: |
        // Mock errors
        mockChronik.setTx(txid, new Error('Not found'));
        await expect(chronik.tx(txid)).rejects.toThrow('Not found');

    - type: "teardown"
      statement: |
        // Cleanup after test
        afterEach(() => {
          mockChronik = null;
        });
```

**AI Role Settings:**
```
When using mock-chronik-client to write tests:
1. Create new MockChronikClient instance in beforeEach
2. Use setTx, setUtxosByAddress etc. to set mock data
3. Can mock any error scenario
4. WebSocket methods are the same as real chronik-client
5. Includes MockAgora for testing Agora offers
```

---

## bitcoin-abc

```yaml
- name: "bitcoin-abc"
  description: "eCash full node and development framework"
  files:
    - "**/*bitcoin*abc*"
    - "**/modules/**"
    - "**/chronik/**"
  rules:
    - type: "cpp-style"
      statement: |
        # C++ Code Standards
        - Indentation: 4 spaces (LLVM style)
        - Functions: CamelCase
        - Variables: lowerCamelCase
        - Member variables: m_ prefix
        - Constants: UPPER_SNAKE_CASE
        - Namespaces: lower_snake_case

    - type: "imports"
      statement: |
        # TypeScript Module Import Order
        1. External dependencies (node_modules)
        2. Internal modules (@ecash-lib, chronik-client)
        3. Relative imports (./, ../)
        4. Type imports use import type

    - type: "testing"
      statement: |
        # Testing Requirements
        - All new features must have unit tests
        - Public APIs must have documentation comments
        - Use describe/it style
        - Mock external dependencies

    - type: "commit"
      statement: |
        # Commit Standards
        - Use arc diff to create diff
        - Follow Conventional Commits
        - feat: new feature
        - fix: bug fix
        - test: test related
        - docs: documentation related
```

**AI Role Settings:**
```
When writing code for the Bitcoin ABC project:
1. C++ code follows LLVM coding standards
2. TypeScript uses strict mode
3. All public APIs must have JSDoc comments
4. Run relevant tests before committing
5. Use arc lint for code checking
6. Do not commit directly to master/main, create a topic branch first
```
