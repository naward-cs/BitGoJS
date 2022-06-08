import * as openpgp from 'openpgp';
import 'should';

import { openpgpUtils } from '@bitgo/sdk-core';

describe('OpenGPG Utils Tests', function () {
  let senderKey: { publicKey: string, privateKey: string };
  let recipientKey: { publicKey: string, privateKey: string };
  let otherKey: { publicKey: string, privateKey: string };

  before(async function () {
    senderKey = await openpgp.generateKey({
      userIDs: [
        {
          name: 'sender',
          email: 'sender@username.com',
        },
      ],
    });
    recipientKey = await openpgp.generateKey({
      userIDs: [
        {
          name: 'recipient',
          email: 'recipient@username.com',
        },
      ],
    });
    otherKey = await openpgp.generateKey({
      userIDs: [
        {
          name: 'other',
          email: 'other@username.com',
        },
      ],
    });
  });

  describe('encrypt and decrypt with signing', function() {
    it('should successfully encrypt, sign, and decrypt', async function () {
      const text = 'original message';

      const signedMessage = await openpgpUtils.encryptAndSignText(text, recipientKey.publicKey, senderKey.privateKey);
      const decryptedMessage = await openpgpUtils.readSignedMessage(signedMessage, senderKey.publicKey, recipientKey.privateKey);

      decryptedMessage.should.equal(text);
    });

    it('should fail on verification with wrong public key', async function () {
      const text = 'original message';

      const signedMessage = await openpgpUtils.encryptAndSignText(text, recipientKey.publicKey, senderKey.privateKey);
      await openpgpUtils.readSignedMessage(signedMessage, otherKey.publicKey, recipientKey.privateKey)
        .should.be.rejected();
    });

    it('should fail on decryption with wrong private key', async function () {
      const text = 'original message';

      const signedMessage = await openpgpUtils.encryptAndSignText(text, recipientKey.publicKey, senderKey.privateKey);
      await openpgpUtils.readSignedMessage(signedMessage, senderKey.publicKey, otherKey.privateKey)
        .should.be.rejectedWith('Error decrypting message: Session key decryption failed.');
    });

    it('should fail on signature verification', async function () {
      const text = 'original message';

      const message = await openpgp.createMessage({ text });

      const otherPrivateKey = await openpgp.readPrivateKey({ armoredKey: otherKey.privateKey });
      const invalidSignature = await openpgp.sign({
        message,
        signingKeys: otherPrivateKey,
        detached: true,
      });

      const signedMessage = await openpgpUtils.encryptAndSignText(text, recipientKey.publicKey, senderKey.privateKey);
      const invalidSignedMessage = {
        encryptedText: signedMessage.encryptedText,
        signature: invalidSignature,
      };
      await openpgpUtils.readSignedMessage(invalidSignedMessage, senderKey.publicKey, recipientKey.privateKey)
        .should.be.rejectedWith('Signature does not match public key');
    });
  });
});
